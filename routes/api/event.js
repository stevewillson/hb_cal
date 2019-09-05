var express = require('express')
var router = express.Router()
var ICAL = require('ical.js')
var fs = require('fs')
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

/* POST event endpoint */
/* Create a new event */
router.post('/api/event', function (req, res) {
  // json object will be in req.body, figure out how to handle file imports next

  // Set our internal DB variable
  const db = req.db
  // Set our collection
  const collection = db.get('usercollection')

  // this will be a single event import
  if (req.body !== 'undefined') {

    // check to make sure the start date and end date are defined
    if (req.body.eventStartDate !== "" && req.body.eventEndDate !== "") {

      // the values will be passed from a JSON object and not POST data now
      const eventCategory = req.body.eventCategory
      const eventTitle = req.body.eventTitle
      const eventType = req.body.eventType
      const eventStartDate = req.body.eventStartDate
      const eventEndDate = req.body.eventEndDate
      const eventLocation = req.body.eventLocation

      const vevent = new ICAL.Component('vevent')
      var event = new ICAL.Event(vevent)

      event.summary = eventTitle

      // add these as custom properties of the vevent because they are not typically part of vevents
      vevent.addPropertyWithValue('category', eventCategory)
      vevent.addPropertyWithValue('type', eventType)
      vevent.addPropertyWithValue('location', eventLocation)

      const sDate = new Moment(eventStartDate)
      const eDate = new Moment(eventEndDate)

      event.startDate = new ICAL.Time({
        year: sDate.year(),
        month: sDate.month() + 1,
        day: sDate.date()
      })

      event.endDate = new ICAL.Time({
        year: eDate.year(),
        month: eDate.month() + 1,
        day: eDate.date()
      })

      // Submit to the DB
      collection.insert({
        vevent: event.component.jCal
      }, function (err, doc) {
        if (err) {
          // If it failed, return error
          res.send('There was a problem adding the information to the database.')
        } else {
          // And forward to success page
          res.status(200).send({
            title: 'success',
            vevent: event.component.jCal
          })
        }
      })
    }
  }
})

/**
  * GET all events listed in the database
  * Returns an alphabatized list of events from the database, alphabatized by 'category'
  */
router.get('/api/event', function (req, res) {
  var db = req.db
  var collection = db.get('usercollection')

  collection.find({}, {}, function (e, docs) {
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

// GET a single event by event id
router.get('/api/event/:id', function (req, res) {
  let db = req.db
  let collection = db.get('usercollection')
  const id = req.params.id

  collection.findOne({ _id: id }, {}, function (e, docs) {
    // add things here to massage the mongodb data so it is consistent for the calendar?
    let calEventType = ''
    try {
      // -> DTMS Event
      if (docs.vevent[1][0][3] === 'Unit Training Plan Event') {
        calEventType = 'DTMS_Calendar'
      } else if (docs.vevent[1].length === 15) {
        // -> Google Calendar Event
        calEventType = 'Google_Calendar'
      } else if (docs.vevent[1].length === 22) {
        // -> Confluence Calendar
        calEventType = 'Confluence_Calendar'
      } else if (docs.vevent[1].length === 6) {
        // -> Hand Entry Calendar
        calEventType = 'Hand_Entry_Calendar'
      }
    } catch (err) {
      calEventType = 'Unknown'
    }

    let eventCategory = ''
    let eventType = ''
    let eventSummary = ''
    let eventStartDate = ''
    let eventEndDate = ''
    let eventLocation = ''
 
    if (calEventType === 'DTMS_Calendar') {
      eventSummary = docs.vevent[1][8][3]
      eventCategory = docs.vevent[1][0][3]
      eventStartDate = new Moment(docs.vevent[1][5][3]).format('YYYY-MM-DD')
      eventEndDate = new Moment(docs.vevent[1][3][3]).format('YYYY-MM-DD')
    } else if (calEventType === 'Google_Calendar') {
      eventSummary = docs.vevent[1][13][3]
      eventStartDate = new Moment(docs.vevent[1][0][3]).format('YYYY-MM-DD')
      eventEndDate = new Moment(docs.vevent[1][1][3]).format('YYYY-MM-DD')
    } else if (calEventType === 'Confluence_Calendar') {
      eventSummary = docs.vevent[1][3][3]
      eventCategory = docs.vevent[1][10][3]
      eventStartDate = new Moment(docs.vevent[1][1][3]).format('YYYY-MM-DD')
      eventEndDate = new Moment(docs.vevent[1][2][3]).format('YYYY-MM-DD')
    } else if (calEventType === 'Hand_Entry_Calendar') {
      eventSummary = docs.vevent[1][0][3]
      eventCategory = docs.vevent[1][1][3]
      eventType = docs.vevent[1][2][3]
      eventStartDate = new Moment(docs.vevent[1][4][3]).format('YYYY-MM-DD')
      eventEndDate = new Moment(docs.vevent[1][5][3]).format('YYYY-MM-DD')
      eventLocation = docs.vevent[1][3][3]
    }

    let newEvent = {
      eventSummary: eventSummary,
      eventCategory: eventCategory,
      eventType: eventType,
      eventStartDate: eventStartDate,
      eventEndDate: eventEndDate,
      eventImportType: calEventType,
      eventLocation: eventLocation,
      _id: docs._id
    }

    res.status(200).send({
      event: newEvent
    })
  })
})



/* PUT to update a pre-existing event */
router.put('/api/event', function (req, res) {
  console.log('PUT received, reached the UPDATE endpoint')
  // json object will be in req.body, figure out how to handle file imports next

  // Set our internal DB variable
  const db = req.db
  // Set our collection
  const collection = db.get('usercollection')

  // this will be a single event import
  if (req.body !== 'undefined') {

    // check to make sure the start date and end date are defined
    if (req.body.eventStartDate !== "" && req.body.eventEndDate !== "") {

      // the values will be passed from a JSON object and not POST data now
      const eventId = req.body.eventId
      const eventCategory = req.body.eventCategory
      const eventTitle = req.body.eventTitle
      const eventType = req.body.eventType
      const eventStartDate = req.body.eventStartDate
      const eventEndDate = req.body.eventEndDate
      const eventLocation = req.body.eventLocation

      const vevent = new ICAL.Component('vevent')
      var event = new ICAL.Event(vevent)

      event.summary = eventTitle

      // add these as custom properties of the vevent because they are not typically part of vevents
      vevent.addPropertyWithValue('category', eventCategory)
      vevent.addPropertyWithValue('type', eventType)
      vevent.addPropertyWithValue('location', eventLocation)

      const sDate = new Moment(eventStartDate)
      const eDate = new Moment(eventEndDate)

      event.startDate = new ICAL.Time({
        year: sDate.year(),
        month: sDate.month() + 1,
        day: sDate.date()
      })

      event.endDate = new ICAL.Time({
        year: eDate.year(),
        month: eDate.month() + 1,
        day: eDate.date()
      })

      // Submit to the DB
      collection.findOneAndUpdate(
        { _id: eventId },
        { $set: {vevent: event.component.jCal } }, 
        function (err, doc) {
          if (err) {
            // If it failed, return error
            res.send('There was a problem adding the information to the database.')
          } else {
            // And forward to success page
            res.status(200).send({
              title: 'success',
              vevent: event.component.jCal
            })
          }
        }
      )
    }
  }
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
