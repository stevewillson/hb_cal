var express = require('express');
var router = express.Router();
var ICAL = require("ical.js");
var moment = require("moment");

/* GET New Event page. */
router.get('/newevent', function(req, res) {
  res.render('newevent', { title: 'Add New Event' });
});

/* POST to Add Event Service */
router.post('/newevent', function(req, res) {

  // Set our internal DB variable
  var db = req.db;
  // Set our collection
  var collection = db.get('usercollection');

  // Get the form values. These rely on the 'name' attributes
	// using express-formidable, the POST values are in the req.fields object
  var eventCategory = req.fields.eventcategory;
  var eventTitle = req.fields.eventname;
  var eventType = req.fields.eventtype;
  var eventStartDate = req.fields.date_start;
  var eventEndDate = req.fields.date_end;

  var vevent = new ICAL.Component('vevent');
  var event = new ICAL.Event(vevent);

  event.summary = eventTitle;

  // add these as custom properties of the vevent because they are not typically part of vevents
  vevent.addPropertyWithValue("category", eventCategory);
  vevent.addPropertyWithValue("type", eventType);

  var sDate = new moment(eventStartDate);
  var eDate = new moment(eventEndDate);

  event.startDate = new ICAL.Time({
    year: sDate.year(),
    month: sDate.month()+1,
    day: sDate.date()
  });

  event.endDate = new ICAL.Time({
    year: eDate.year(),
    month: eDate.month()+1,
    day: eDate.date()
  });

  // Submit to the DB
  collection.insert({
    "vevent": event.component.jCal
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect(".");
    }
  });
});

module.exports = router;
