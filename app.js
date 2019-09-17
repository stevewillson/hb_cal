var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')

const config = require('./config')

var Mongoose = require('mongoose')

const { db: { host, port, name } } = config 
const connectionString = `mongodb://${host}:${port}/${name}`
Mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })

var db = Mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

var apiRouter = require('./routes/api')
var indexRouter = require('./routes/index')
var eventsRouter = require('./routes/events')
var transferRouter = require('./routes/transfer')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))

// used to parse JSON data that is passed from the add event and delete event endpoints
app.use(express.json())

// used to parse the POST request to set the calendar date, can I make a different type of POST request to pass JSON data with these parameters?
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

// is this necessary for Mongoose?
// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db
  next()
})

app.use('/api', apiRouter)
app.all('/', indexRouter)
app.get('/events', eventsRouter)
app.get('/transfer', transferRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(2999)
module.exports = app
