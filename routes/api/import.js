var express = require('express');
var router = express.Router();
var ICAL = require('ical.js');
var moment = require('moment');
var fs = require('fs');
var util = require('util');

/* POST import page. */
router.post('/api/import', function(req, res) {

    //use this command to upload the ical file
    // curl -F 'importfile=@/home/user/ical.ics' http://localhost:3000/api/import



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

		// get the component layer, useful for parsing events
		var vcal = new ICAL.Component(jcalData);
		var vevents = vcal.getAllSubcomponents("vevent");

		// iterate through all events to add them to the database
		for (var venv = 0; venv < vevents.length; venv++){
		  var event = new ICAL.Event(vevents[venv]);
      try {
				// Submit to the DB
				collection.insert({
          "vevent": event
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
    res.status(200).send({
      "title": "success"
    });
  });
});

module.exports = router;
