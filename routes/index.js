var moment = require('moment');
var cookieParser = require('cookie-parser');
var ICAL = require('ical.js');
var formidableMiddleware = require('express-formidable');
var fs = require('fs');
var util = require('util');

var express = require('express');
var router = express.Router();

router.use(formidableMiddleware());
router.use(cookieParser());

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{sort: {category: 1, date_start: 1}},function(e,docs){
    res.render('index', {
      "title": "Horseblanket Calendar",
      "events" : docs,
      "moment" : moment,
      "cal_view" : req.cookies
    });
  });
});

/* POST to Set Begin and End of Calendar Display */
router.post('/', function(req, res) {

	console.log("TEST");
	var form = new formidableMiddleware.IncomingForm();
	form.parse(req, function (err, fields, files) {
		console.log(fields);

	});

  // Get our form values. These rely on the 'name' attributes

	/*
  var beginDate = req.body.datebegin;
  var endDate = req.body.dateend;
  var cell_width = req.body.cell_width;
  res.cookie("beginDate", beginDate, {expire : new Date() + 9999});
  res.cookie("endDate", endDate, {expire : new Date() + 9999});
  res.cookie("cell_width", cell_width, {expire : new Date() + 9999});
	*/

  // Forward to index page
  res.redirect("/");
});
  
/* GET Events page. */
router.get('/events', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{sort: {category: 1, date_start: 1}},function(e,docs){
    res.render('events', {
      "title": "Event Page",
      "events" : docs
    });
  });
});

/* GET transfer page. */
router.get('/transfer', function(req, res) {
  res.render('transfer', {
    "title": "Transfer Page",
  });
});

/* POST import page. */
router.post('/import', function(req, res) {

	if (Object.keys(req.files).length == 0) {
		return res.status(400).send('No files were uploaded.');
	}

  // Set our internal DB variable
  var db = req.db;
	// Set our collection
	var collection = db.get('usercollection');

	// The name of the input field (i.e. "importfile") is used to retrieve the uploaded file
	let importfile = req.files.importfile;

  fs.readFile(importfile.path, "utf8",  function (err, data) {

		// read and parse the uploaded .ics file 
		var jcalData = new ICAL.parse(data);

		// determine the calendar name, for google calendar, it is stored at a specific location
		var calname = '';
		if ( jcalData[1][4][0] == "x-wr-calname" ) {
			calname = jcalData[1][4][3];
		} else {
			calname = "Test Cal"; 
		}

		var eventCategory = calname;
		var eventTitle;
		var eventType;
		var eventStartDate;
		var eventEndDate;

		// get the component layer, useful for parsing events
		var vcal = new ICAL.Component(jcalData);
		var vevents = vcal.getAllSubcomponents("vevent");

		// iterate through all events to add them to the database
		for (var venv = 0; venv < vevents.length; venv++){
		  var event = new ICAL.Event(vevents[venv]);
      try {

				// assign the event summary as the Title
				eventTitle = event.summary;

				// hardcoded in eventType at this time
				eventType = "Training";

				// convert the dates to a moment object
				var startdate = new moment(event.startDate.toJSDate());
				var enddate = new moment(event.endDate.toJSDate());
				eventStartDate = startdate.format("YYYY-MM-DD");
				eventEndDate = enddate.format("YYYY-MM-DD");

				// Submit to the DB
				collection.insert({
					"category" : eventCategory,
					"event" : eventTitle,
					"eventtype" : eventType,
					"date_start" : eventStartDate,
					"date_end" : eventEndDate
				}, function (err, doc) {
					if (err) {
						// If it failed, return error
						res.send("There was a problem adding the information to the database.");
					}
				});
			}
      catch {
				console.log("Couldn't insert event, malformed?");
			}
		}
		// forward to success page
		res.redirect("/");
  });
});

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

  var eventCategory = "";
  var eventTitle = "";
  var eventType = "";
  var eventStartDate = "";
  var eventEndDate = "";
 
 	/*	
  // Get our form values. These rely on the 'name' attributes
  var eventCategory = req.body.eventcategory;
  var eventTitle = req.body.eventname;
  var eventType = req.body.eventtype;
  var eventStartDate = req.body.date_start;
  var eventEndDate = req.body.date_end;
	*/

  // Submit to the DB
  collection.insert({
    "category" : eventCategory,
    "event" : eventTitle,
    "eventtype" : eventType,
    "date_start" : eventStartDate,
    "date_end" : eventEndDate
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("/");
    }
  });
});

/* POST to Delete Event Service */
router.post('/delevent', function(req, res) {

  // Set our internal DB variable
  var db = req.db;


  var documentid = "";
  /*
  // Get our form values. These rely on the 'name' attributes
  var documentid = req.body.documentid;
	*/

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.remove({
    "_id" : documentid
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem removing the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("/");
    }
  });
});

module.exports = router;
