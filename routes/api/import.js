var express = require('express')
var router = express.Router()
var ICAL = require('ical.js')
var fs = require('fs')
var Moment = require('moment')

/* POST import page. */
router.post('/api/import', function (req, res) {
  // use this command to upload the ical file
  // curl -F 'importFile=@/home/user/ical2.ics' http://localhost:3000/api/import

  // Set our internal DB variable
  const db = req.db
  // Set our collection
  const collection = db.get('usercollection')

  // if no file was posted, then check to see if there is some content in the req.fields
  if (Object.keys(req.files).length === 0) {
    const eventCategory = req.fields.eventCategory
    const eventTitle = req.fields.eventName
    const eventType = req.fields.eventType
    const eventStartDate = req.fields.eventStartDate
    const eventEndDate = req.fields.eventEndDate
    const eventLocation = req.fields.eventLocation

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
  } else {
    // The name of the input field (i.e. "importFile") is used to retrieve the uploaded file
    const importFile = req.files.importFile

    fs.readFile(importFile.path, 'utf8', function (err, data) {
      if (err) {
        // If it failed, return error
        res.send('Error opening file.')
      }
      // read and parse the uploaded .ics file
      var jcalData = new ICAL.parse(data)

      // get the component layer, useful for parsing events
      var vcal = new ICAL.Component(jcalData)
      var vevents = vcal.getAllSubcomponents('vevent')

      // iterate through all events to add them to the database
      for (var venv = 0; venv < vevents.length; venv++) {
        var event = new ICAL.Event(vevents[venv])
        // event.addPropertyWithValue('category', '')
        // event.addPropertyWithValue('type', '')
        // event.addPropertyWithValue('location', '')
        try {
          // Submit to the DB
          collection.insert({
            vevent: event.component.jCal
          }, function (err, doc) {
            if (err) {
              // If it failed, return error
              res.send('There was a problem adding the information to the database.')
            }
          })
        } catch (err) {
          console.log('Could not insert event, malformed?')
        }
      }
      res.status(200).send({
        title: 'success',
        vevent: event.component.jCal
      })
    })
  }
})

module.exports = router
