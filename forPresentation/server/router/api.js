const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const jwt = require('jsonwebtoken')


const url = 'mongodb+srv://simon:test123@cluster0.wkrdr.mongodb.net/AgProject?retryWrites=true&w=majority'
mongoose.connect(url, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
});

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

router.get('/providers', (req,res) => {
  let serProviders = [
    {
      "_id": "1",
      "name": "Simon Kiflay",
      "email": "simon@gmail.com",
      "tele": "123456",
      "profession": "software developer",
      "experience": "I have 5 years of Full-Stack Web Application with AWS cloud deployment",
      "services" : "I would like to contribute to my community in realtion to software development"
    },
    {
    "_id": "2",
    "name": "keysi",
    "email": "keysi@gmail.com",
    "tele": "1235478",
    "profession": "software developer",
    "experience": "I have 5 years of Full-Stack Web Application with AWS cloud deployment",
    "services" : "I would like to contribute to my community in realtion to software development"
  }
    
  ]
  res.json(serProviders)
})

router.get('/buyers', verifyToken, (req, res) => {
  let serBuyers = [
    {
      "_id": "1",
      "name": "Assad Saad",
      "description": "CEO of MIU Company",
      "serviceNeeded": "Two software developers with experience in Node.js and Angular",
      "payment": "70/hr",
      "email": "assad@miu.edu.com"
    },
    {
        "_id": "1",
        "name": "Thao",
        "description": "Manager MIU Company",
        "serviceNeeded": "one software developers with experience in Node.js and Angular",
        "payment": "70/hr",
        "email": "thao@miu.edu.com"
      }
  ]
  res.json(serBuyers)
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)      
    } else {
      let payload = {subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      console.log(err)    
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else 
      if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = {subject: user._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    }
  })
})

module.exports = router;