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
        return {message: 'invalid username', error: true}
    }
    // console.log(visitor)

    const valid = await bcrypt.compare(req.body.password, visitor.password)
    if(!valid){
        console.log("wrong password")
        // res.send('<p>!!!! login unsuccessful. Wrong password</p>')
        return {message: 'wrong password', error: true}
    }
    else{
        console.log("login successfully!")
        if(visitor.role == "admin")
            return {admin: true, player: true, who: visitor, error: false}
        else return {admin: false, player: true, who: visitor, error: false}
    }
}

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken

        // giving status of logged out or not
        db.collection('blacklist').countDocuments({token: req.token})
            .then(count => {
                if(count > 0){
                    console.log("this user logged out already")
                    req.logout = "true"
                }
                else req.logout = "false"
                console.log("verifyToken executed")
                //** put 'next' within then, so 'logout' won't be run before req.token is defined
                next()
            })
    } 
    else  res.sendStatus(403) // Forbidden    
}

function logout(req, res, next){
    console.log("Logged out: ", req.logout)
    //if logged out then return unauthorized
    if(req.logout == "true"){
        // res.sendStatus(401)
        res.json({status: 'logged-out-already'})
        return
    }
    //if not logged out, continue. Then, append the token to blacklist
    db.collection('blacklist').countDocuments({token: req.token})
        .then(count => {
            if(count == 0){
                db.collection('blacklist').insertOne({token: req.token})
                res.json({status: 'logged-out-successfully'})
            }
        })
    next()
}

module.exports = {loginAuth, verifyToken, logout}