var express = require('express')
var router = express.Router()
var Moment = require('moment')
var request = require('request')

/* GET home page. */
router.get('/', function (req, res, next) {
  // use the api to request the events
  request('http://localhost:3000/api/event', function (error, response, body) {
    if (error) {
      console.log('An error occurred while requesting the event API: ' + error)
    }

    // determine what is returned and then pass it along to render the hb_cal view
    res.render('index', {
      title: 'Horseblanket Calendar',
      events: JSON.parse(body),
      Moment: Moment,
      calView: req.cookies
    })
  })
})

/* POST to Set Begin and End of Calendar Display */
router.post('/', function (req, res) {
  // the req.fields object contains the POST values
  var startDate = req.fields.startDate
  var endDate = req.fields.endDate
  var cellWidth = req.fields.cellWidth
  res.cookie('startDate', startDate, { expire: new Date() + 9999 })
  res.cookie('endDate', endDate, { expire: new Date() + 9999 })
  res.cookie('cellWidth', cellWidth, { expire: new Date() + 9999 })

  // Forward to index page
  res.redirect('.')
})

module.exports = router
