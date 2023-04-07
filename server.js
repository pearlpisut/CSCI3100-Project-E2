const express = require('express')
const {connectToDb, getDb}  = require('./db')
const path = require('path')
const bcrypt = require('bcrypt')
const {loginAuth, verifyToken} = require('./middlewares/auth')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectId

const PORT = process.env.PORT

const app = express()

// const cors = require("cors")

// app.use(cors({
//     origin: '*'
// }))

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
                    // if(responsee.admin == 'no') res.send("This admin user doesn't exist")
                    if(responsee.admin == 'no' && responsee.player == 'yes')
                        res.send('welcome player ', responsee.who.username)
                    else if(responsee.admin =='yes'){
                        jwt.sign(responsee.who, process.env.SECRET_ADMIN_KEY, (err, token) =>{
                            if(err) res.sendStatus(403)
                            res.json({token})
                        })
                    }
                    else // else if(responsee.admin == 'no' && responsee.player == 'no')
                        res.send('you are not a registered player')
                })
            })
        })
        
//admin manu
app.get('/main/admin', verifyToken, (req, res) => {
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
                .then(()=> {
                    //res.render("usermanage.ejs", {items: items})
                    res.json(items)
                })
            }
          })
        // console.log("this is the admin, username: ", req.user.username)
})
    
app.delete('/main/admin/delete/:id', verifyToken, (req, res) =>{
        jwt.verify(req.token, process.env.SECRET_ADMIN_KEY, (err, authData) => {
            if(err) res.sendStatus(403);
            else {
                printDeletedUser(req.params.id, res)
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
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            newuser.password = hashedPassword
            db.collection("users").insertOne(newuser)
            res.redirect('/login')
        } catch{
            res.redirect('/register')
        }
        console.log(newuser)
    })

//game history
app.get('/main/admin/gamehist', verifyToken, (req, res) =>{
    jwt.verify(req.token, process.env.SECRET_ADMIN_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else {
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

app.get('/main/admin/gamehist/:id', verifyToken, (req, res) =>{
    jwt.verify(req.token, process.env.SECRET_ADMIN_KEY, (err, authData) => {
        if(err) res.sendStatus(403);
        else {
            let game = db.collection('games').findOne({'_id': ObjectId(req.params.id)})
            res.json(game)
        }
      })
})

function printDeletedUser(id, res){
    db.collection('users').findOne({'_id': new ObjectId(id)})
        .then(user => res.send(`deleted ${user.username}`))
}
