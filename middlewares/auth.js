const express = require('express')
require('dotenv').config()
// const router = express.Router()
const bcrypt = require('bcrypt')
const {connectToDb, getDb}  = require('../db')
const jwt = require('jsonwebtoken')

let db = getDb()

connectToDb((err)=>{
    if(!err){
        db = getDb()
        console.log("Authorization enabled")
    }
})

async function loginAuth(res, req, visitor){
    if(!visitor){
        console.log("invalid username")
        res.send('<p>invalid username</p>')
        return
    }
    // console.log(visitor)

    const valid = await bcrypt.compare(req.body.password, visitor.password)
    if(!valid){
        console.log("wrong password")
        // res.send('<p>!!!! login unsuccessful. Wrong password</p>')
        console.log('tester')
        return {admin: "no", player: "no"}
    }
    else{
        console.log("login successfully!")
        if(visitor.role == "admin")
            return {admin: "yes", player: 'yes', who: visitor}
        else return {admin: "no", player: "yes", who: visitor}
    }
}

function adminAuth(req, res){
    if(token == null)
        return res.send("u are not signed in")
    console.log(2)
    jwt.verify(token, process.env.SECRET_ADMIN_KEY, (err, user) => {
        if(err){
            return res.send("erorrr")
        }
        req.user = user
    })
}

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } 
    else  res.sendStatus(403) // Forbidden    
}

module.exports = {loginAuth, verifyToken}