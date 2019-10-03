var express = require('express')
var router = express.Router()
var Moment = require('moment')
const fetch = require('node-fetch')
const { DateTime } = require('luxon')

const config = require('../config')
const { app: { eventRequestURLEndpoint } } = config
const { app: { orgRequestURLEndpoint } } = config

/* GET home page. */
router.get('/', function (req, res, next) {
  // use the api to request the events
	fetch('http://localhost:3000/api/event')
	  .then(function (response) {
		  return response.json()
		})
		.then(function (eventList) {
			res.render('index', {
				title: 'Horseblanket Calendar',
				events: eventList,
				DateTime: DateTime,
				calView: req.cookies,
				eventRequestURLEndpoint: eventRequestURLEndpoint,
				orgRequestURLEndpoint: orgRequestURLEndpoint,
			})
		})
})

/* POST to Set Begin and End of Calendar Display */
router.post('/', function (req, res) {
  // the req.body object contains the POST values
  var startDate = req.body.startDate
  var endDate = req.body.endDate
  var cellWidth = req.body.cellWidth
  res.cookie('startDate', startDate, { expire: new Date() + 9999 })
  res.cookie('endDate', endDate, { expire: new Date() + 9999 })
  res.cookie('cellWidth', cellWidth, { expire: new Date() + 9999 })

  // Forward to index page
  res.redirect('.')
})

module.exports = router
