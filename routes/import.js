var express = require('express');
var router = express.Router();

//var cookieParser = require('cookie-parser');
var ICAL = require('ical.js');
//var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');


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

module.exports = router;
