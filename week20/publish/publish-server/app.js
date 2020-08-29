var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  bodyParser.raw({
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream',
  })
)

app.use('/', indexRouter)

module.exports = app
