var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// formidable seems more popular and has less dependencies, use it
const Formidable = require('formidable')

var monk = require('monk')
var db = monk('localhost:27017/hb_cal')

var indexRouter = require('./routes/index')
var eventsRouter = require('./routes/events')
var transferRouter = require('./routes/transfer')
var eventAPIRouter = require('./routes/api/event')
var importAPIRouter = require('./routes/api/import')

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
app.use(express.static(path.join(__dirname, 'public')))

// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db
  next()
})

app.all('/', indexRouter)
app.get('/events', eventsRouter)
app.get('/transfer', transferRouter)
app.all('/api/event', eventAPIRouter)
app.get('/api/event/:id', eventAPIRouter)

app.post('/api/import', importAPIRouter)
// app.post('/api/import', (req, res) => {
  // var form = new Formidable.IncomingForm()
// }

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

module.exports = app
