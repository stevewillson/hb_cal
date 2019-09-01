var express = require('express')
var router = express.Router()
var Moment = require('moment')


function sortByProperty (property) {
  return function (x, y) {
    if (x[property] === y[property]) {
      return 0
    } else if (x[property] > y[property]) {
      return 1
    } else {
      return -1
    }
  }
}

/**
  * GET events listed in the database
  * Returns an alphabatized list of events from the database, alphabatized by 'category'
  */
router.get('/api/event', function (req, res) {
  var db = req.db
  var collection = db.get('usercollection')

  collection.find({}, { sort: { category: 1, date_start: 1 } }, function (e, docs) {
    // add things here to massage the mongodb data so it is consistent for the calendar?
    var events = []
    var calEventType = ''
    for (var i = 0; i < docs.length; i++) {
      calEventType = ''
      try {
        // -> DTMS Event
        if (docs[i].vevent[1][0][3] === 'Unit Training Plan Event') {
          calEventType = 'DTMS_Calendar'
        } else if (docs[i].vevent[1].length === 15) {
          // -> Google Calendar Event
          calEventType = 'Google_Calendar'
        } else if (docs[i].vevent[1].length === 22) {
          // -> Confluence Calendar
          calEventType = 'Confluence_Calendar'
        } else if (docs[i].vevent[1].length === 6) {
          // -> Hand Entry Calendar
          calEventType = 'Hand_Entry_Calendar'
        }
      } catch (err) {
        calEventType = 'Unknown'
      }

      var eventCategory = ''
      var eventType = ''
      var eventSummary = ''
      var eventStartDate = ''
      var eventEndDate = ''
      var eventLocation = ''

      if (calEventType === 'DTMS_Calendar') {
        eventSummary = docs[i].vevent[1][8][3]
        eventCategory = docs[i].vevent[1][0][3]
        eventStartDate = new Moment(docs[i].vevent[1][5][3]).format('YYYY-MM-DD')
        eventEndDate = new Moment(docs[i].vevent[1][3][3]).format('YYYY-MM-DD')
      } else if (calEventType === 'Google_Calendar') {
        eventSummary = docs[i].vevent[1][13][3]
        eventStartDate = new Moment(docs[i].vevent[1][0][3]).format('YYYY-MM-DD')
        eventEndDate = new Moment(docs[i].vevent[1][1][3]).format('YYYY-MM-DD')
      } else if (calEventType === 'Confluence_Calendar') {
        eventSummary = docs[i].vevent[1][3][3]
        eventCategory = docs[i].vevent[1][10][3]
        eventStartDate = new Moment(docs[i].vevent[1][1][3]).format('YYYY-MM-DD')
        eventEndDate = new Moment(docs[i].vevent[1][2][3]).format('YYYY-MM-DD')
      } else if (calEventType === 'Hand_Entry_Calendar') {
        eventSummary = docs[i].vevent[1][0][3]
        eventCategory = docs[i].vevent[1][1][3]
        eventType = docs[i].vevent[1][2][3]
        eventStartDate = new Moment(docs[i].vevent[1][4][3]).format('YYYY-MM-DD')
        eventEndDate = new Moment(docs[i].vevent[1][5][3]).format('YYYY-MM-DD')
        eventLocation = docs[i].vevent[1][3][3]
      }

      var newEvent = {
        eventSummary: eventSummary,
        eventCategory: eventCategory,
        eventType: eventType,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventImportType: calEventType,
        eventLocation: eventLocation,
        _id: docs[i]._id
      }
      events.push(newEvent)
    }

    /* Sort the array so that returns sorted first by category
     */
    let sortedEvents = events.sort(sortByProperty('eventCategory'))

    res.status(200).send({
      events: sortedEvents
    })
  })
})

/* DELETE to Delete Event Service */
router.delete('/api/event', function (req, res) {
  // Set our internal DB variable
  var db = req.db

  // Get our form values. These rely on the 'name' attributes
  // var documentid = req.fields.documentid
  var documentid = req.body.documentid

  // Set our collection
  var collection = db.get('usercollection')

  // Submit to the DB
  collection.remove({
    _id: documentid
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send('There was a problem removing the information to the database.')
    } else {
      // And forward to success page
      res.status(200).send({
        delete: 'success'
      })
    }
  })
})

module.exports = router
