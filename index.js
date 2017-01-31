const express = require('express')
const session = require('express-session')
const _ = require('lodash')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const users = [
  {name: 'Bill', password: 'superman', admin: true},
  {name: 'Budd', password: 'password123', admin: false},
  {name: 'O-Ren', password: 'cottenmouth', admin: false},
  {name: 'Vernita', password: 'copperhead', admin: false},
  {name: 'Elle', password: 'fuckkiddo', admin: false},
  {name: 'Beatrix', password: 'killbill', admin: true}
]

app.get('/', (req, res) => {
  res.redirect('/public')
})
app.get('/public', (req, res) => {
  res.send('This is for the people')
})
app.get('/private', isAuthentic, (req, res) => {
  res.send('Welcome to the upper-middle class bitches')
})
app.get('/admin', isAuthentic, isAdmin, (req, res) => {
  res.json(users)
})
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})
app.post('/login', (req, res) => {
  const user = _.find(users, {name: req.body.name})
  if(user){
    if(user.password === req.body.password){
      req.session.userName = user.name
      req.session.admin = user.admin
      res.json({login: 'successful'})
    }else{
      res.json({login: 'invalid password'})
    }
  }else{
    res.json({login: 'no such user'})
  }
})

function isAuthentic(req, res, next){
  if(req.session.userName){
    next()
  }else{
    res.redirect('/login')
  }
}

function isAdmin(req, res, next){
  if(req.session.admin){
    next()
  }else{
    res.send('ACCESS DENIED!')
  }
}

const PORT = 3000

app.listen(PORT, console.log(`Starting server on port ${PORT}`))
