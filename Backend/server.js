const express = require('express')
const {connectToDb, getDb}  = require('./db')
const path = require('path')
const bcrypt = require('bcrypt')
const {loginAuth, verifyToken, logout} = require('./middlewares/auth')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId
require("dotenv").config()

const StreamChat = require('stream-chat').StreamChat;
const uuidv4 = require('uuid').v4;

const PORT = 2901
SECRET_PLAYER_KEY = 34234327
SECRET_ADMIN_KEY =  12345672
//const PORT = process.env.PORT


const app = express()

const cors = require("cors")

app.use(cors({
    origin: '*'
}))


app.set("view-engine", "ejs")
app.set("views", "./views")
app.use(express.static(path.join(__dirname, "static")))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let db = getDb()

connectToDb((err)=>{
    app.listen(PORT, ()=>{
        console.log('running at PORT', PORT)
    })
    if(!err){
        db = getDb()
    }
})

app.get('/', (req, res) => {
    res.render("home.ejs")
})



// Log-in
app.route('/login')
    .get((req, res) => {
        res.render("login.ejs")
    })
    .post((req, res) => {
        let responsee
        db.collection('users').findOne({username: req.body.username})
            .then(data => {
                responsee = loginAuth(res, req, data)
                .then((responsee) => {
                    // neither registered player nor admin
                    if(responsee.error){
                        const returnVal = {
                            message: responsee.message,
                            validated: false
                        }
                        res.json(returnVal)
                    }
                    // player
                    if(!responsee.admin && responsee.player){
                        // only grant access to logged-in user to the game
                        jwt.sign(responsee.who, process.env.SECRET_PLAYER_KEY, (err, token) => {
                            if(err) res.sendStatus(403)
                            let returnVal = {
                                message: `welcome player (${responsee.who.username})`,
                                validated: true,
                                user: responsee.who,
                                type: 'player',
                                friends: responsee.friends
                            }
                            res.json({token, ...returnVal})
                        })
                            
                    }
                    // admin
                    else if(responsee.admin){
                        jwt.sign(responsee.who, process.env.SECRET_ADMIN_KEY, (err, token) =>{
                            if(err) res.sendStatus(403)
                            let returnVal = {
                                message: `welcome admin (${responsee.who.username})`, 
                                validated: true,
                                user: responsee.who,
                                type: 'admin'
                            }
                            res.json({token, ...returnVal})
                        })
                    }

                })
            })
        })


// logout
app.post('/logout', [verifyToken, logout], (req, res) => {
    // add token to be logged out to blacklist.
})
        
//admin menu
app.get('/main/admin', verifyToken, (req, res) => {
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_ADMIN_KEY, (err, authData) => {
        if(err) res.sendStatus(403)
        else {
            let items = []
            db.collection('users')
            .find()
            .forEach(item => {
                if(item.role != "admin")
                    items.push(item)
            })
            .then(()=> res.json(items) )
        }
        })
    // console.log("this is the admin, username: ", req.user.username)
})
    
app.delete('/main/admin/delete/:id', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_ADMIN_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else {
            // printDeletedUser(req.params.id, res)
            console.log('user deleted')
            db.collection('users').deleteOne({'_id': new ObjectId(req.params.id)})
        }
        })
    })

// Registration
app.route('/register')
    .get((req, res) => {
        res.render("regis.ejs")
    })
    .post(async (req, res) => {
        let newuser = {}
        const collection = db.collection('users')
        collection.countDocuments().then((count_doc) => newuser.id = ++count_doc)  //may need to fix this
        newuser.username = req.body.username
        newuser.friends = []
        newuser.rating = 0
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            newuser.password = hashedPassword
            db.collection("users").insertOne(newuser)
            // res.redirect('/login')
            res.json({status: 'ok'})
        } catch{
            // res.redirect('/register')
            res.json({status: 'failed'})

        }
        console.log(newuser)
    })

//game history
app.get('/view/gamehist', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else{
            let items = []
            db.collection('games')
            .find()
            .forEach(item => {
                items.push(item)
            })
            .then(()=>{
                res.status(200).json(items)
            })
        }
      })
})

app.get('/view/gamehist/:id', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else{
            let game = db.collection('games').findOne({'_id': new ObjectId(req.params.id)})
            res.json(game)
        }
      })
})

function printDeletedUser(id, res){
    db.collection('users').findOne({'_id': new ObjectId(id)})
        .then(user => res.send(`deleted ${user.username}`))
}

//showing all user
app.get('/view/allusers', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else{
            let items = []
            db.collection('users')
            .find()
            .forEach(item => items.push(item) )
            .then(()=> res.json(items) )
        }
      })
})

//adding new friend
app.post('/user/friend/add/:id', verifyToken, async (req, res) => {
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, async (err, authData) => {
      if (err) res.sendStatus(403)
      else {
          const friendId = req.params.id
          const self = authData._id
          //add me to friend's friends list
          db.collection('users').findOne({'_id': new ObjectId(friendId)})
          .then(friend => {
              db.collection('users').updateOne({'_id': new ObjectId(friendId)}, {
                $set: {
                    friends: friend.friends?[self, ...friend.friends]:[self]
                }
              })
          })
          //add friend to my friends list
          db.collection('users').findOne({'_id': new ObjectId(self)})
          .then( me => {
            let append
            if(!me.friends) append = [friendId]
            else append = [friendId, ...me.friends]
            db.collection('users').updateOne({'_id': new ObjectId(self)}, {
                $set: {
                    friends: append
                }
              })
          })
          res.send("friend added")
      }
    });
});

//view one's own friend
app.get('/user/friend/view', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else{
            let items = []
            db.collection('users').find({friends: {$all: [authData._id]}})
            .forEach(item => {
                let tmp = {}
                tmp.username = item.username
                tmp.status = 'offline'
                items.push(tmp)
            })
            .then(()=>{
                res.status(200).json(items)
            })
        }
      })
})

//remove friend
app.post('/user/friend/remove/:id', verifyToken, async (req, res) => {
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, async (err, authData) => {
      if (err) res.sendStatus(403)
      else {
            const friendId = req.params.id
            const self = authData._id
            //remove me from friend's friends list
            db.collection('users').updateOne({'_id': new ObjectId(friendId)}, {
                $pull: {
                    friends: self   
                }
            })
            //remove friend from my friends list
            db.collection('users').updateOne({'_id': new ObjectId(self)}, {
                $pull: {
                    friends: friendId   
                }
              })
            db.collection('users').findOne({'_id': new ObjectId(friendId)})
                .then(friend => {
                    res.send(`(${authData.username}) and (${friend.username}) are no longer friends`)
                })
      }
    });
});

//show specific user (for showing opponent's info/a specific friend)
app.get('/view/:id', verifyToken, (req, res) =>{
    if(req.logout == "true"){
        res.sendStatus(401)
        return
    }
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else{
            db.collection('users').findOne({'_id': new ObjectId(req.params.id)})
                .then(user => {
                    let returnVal = {}
                    returnVal.username = user.username
                    returnVal._id = user._id
                    returnVal.friends = user.friends
                    res.json(returnVal)
                })
        }
      })
})

//add new game history to DB
app.post('/gamehist/add', verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, async (err, authData) => {
      if (err) res.sendStatus(403)
      else {
        //receive all data about the game from the request
        const { player1Id, player2Id, startTime, endTime } = req.body
        console.log(player1Id, player2Id, startTime, endTime)    
        try {           
          let newgame = {}
          newgame.player1 = player1Id
          newgame.player2 = player2Id
          newgame.startTime = startTime
          newgame.timeElapsed = endTime-startTime 
          db.collection('games').insertOne(newgame)   
          res.send("added new game history")    
        } catch (err) {
          res.status(400).json({message: err.message});
        }
      }
    });
});

//update rating
app.post('/update/rating', verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_PLAYER_KEY, async (err, authData) => {
      if (err) res.sendStatus(403)
      else {
        //receive all data about the game from the request
        const { player1Id, player2Id, rating1, rating2 } = req.body    
        console.log(player1Id, player2Id, rating1, rating2)
        try {         
            db.collection('users').updateOne({'_id': new ObjectId(player1Id)}, {
                $inc: { rating: rating1 }
            })
            db.collection('users').updateOne({'_id': new ObjectId(player2Id)}, {
                $inc: { rating: rating2 }
            })
          res.send("rating updated")
        } catch (err) {
          res.status(400).json({message: err.message});
        }
      }
    });
});


const api_key = "2pgm4vaqzc3k"
const api_secret = "8dxx394hfvvmwby8uc3pwyd88nucxt37zc3v66pj523r68em5ebbsxwxq4r3xb4t"
const serverClient = StreamChat.getInstance(api_key, api_secret);

/*
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});
*/
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = serverClient.createToken(userId);
      res.json({ token, userId, username, hashedPassword });
    } catch (error) {
      res.json(error);
    }
  });