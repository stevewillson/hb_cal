var express = require('express')
var router = express.Router()
const fetch = require('node-fetch')

/* GET Events page. */
router.get('/events', function (req, res) {
  // retrieve the event list from the api and display it using the .ejs page
  fetch('http://localhost:3000/api/event')
    .then(function (response) {
      return response.json()
    })
    .then(function (eventList) {
      res.render('events', {
        title: 'Event Page',
        events: eventList
      })
    })
})

module.exports = router
