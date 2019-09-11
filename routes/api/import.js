var express = require('express')
var router = express.Router()
var ICAL = require('ical.js')
var fs = require('fs')
var Moment = require('moment')

const Formidable = require('formidable')

/* POST import page. */
router.post('/api/import', function (req, res) {

  // Set our internal DB variable
  const db = req.db
  // Set our collection
  const collection = db.get('usercollection')

  let form = new Formidable.IncomingForm().parse(req)
  form.on('error', (err) => {
    console.log('Error: ', err)
  })
  form.on('file', (name, importFile) => {
    console.log('Uploaded file', name, importFile)
    // this occurs when the file is finished uploading
    fs.readFile(importFile.path, 'utf8', function (err, data) {
      if (err) {
        // If it failed, return error
        res.send('Error opening file.')
      }
      // read and parse the uploaded .ics file
      let jcalData = new ICAL.parse(data)

      // get the component layer, useful for parsing events
      let vcal = new ICAL.Component(jcalData)
      let vevents = vcal.getAllSubcomponents('vevent')

      // iterate through all events to add them to the database
      for (let i = 0; i < vevents.length; i++) {
        // need to keep this 'var' because the 'res.status' uses the event variable
        var event = new ICAL.Event(vevents[i])
        // event.addPropertyWithValue('category', '')
        // event.addPropertyWithValue('type', '')
        // event.addPropertyWithValue('location', '')
        try {
          // Submit to the DB
          collection.insert({
            vevent: event.component.jCal
          }, (err, doc) => {
            if (err) {
              // return error if failed
              res.send('There was a problem adding the information to the database.')
            }
          })
        } catch (err) {
          console.log('Could not insert event, malformed?')
        }
      }
      res.status(200).send({
        title: 'success'
        // this will only return the final event
        // vevent: event.component.jCal
      })
    })
  })
})

module.exports = router
