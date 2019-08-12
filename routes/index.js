var express = require('express');
var moment = require('moment');
var router = express.Router();
var cookieParser = require('cookie-parser');
var ICAL = require('ical.js');
var formidableMiddleware = require('express-formidable');
var fs = require('fs');
var util = require('util');

router.use(formidableMiddleware());


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

  // Get our form values. These rely on the 'name' attributes
  var beginDate = req.body.datebegin;
  var endDate = req.body.dateend;
  var cell_width = req.body.cell_width;
  res.cookie("beginDate", beginDate, {expire : new Date() + 9999});
  res.cookie("endDate", endDate, {expire : new Date() + 9999});
  res.cookie("cell_width", cell_width, {expire : new Date() + 9999});

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
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let importfile = req.files.importfile;

  console.log("NOW FOR FILES");
  //var importfile = JSON.parse(req.files.importfile);
  console.log(importfile);
  //console.log(importfile);

  console.log("BEGIN FILE");
  fs.readFile(importfile.path, "utf8",  function (err, data) {
    //console.log(data);
		var jcalData = new ICAL.parse(data);
		console.log(jcalData);
		var vcal = new ICAL.Component(jcalData);
		var vevents = vcal.getAllSubcomponents("vevent");
		console.log(vevents);
		for (var venv = 0; venv < vevents.length; venv++){
		  var event = new ICAL.Event(vevents[venv]);
      try {
			  console.log(event.summary + " " + event.description);
			  console.log(event.startDate + " " + event.endDate);
			}
      catch {
				console.log("Couldn't print event, malformed?");
			}
		}
    /*
    console.log(_.map(vevents,function(vevent){
			return {
				name: vevent.getFirstPropertyValue("summary"),
				starttime: moment(vevent.getFirstPropertyValue("dtstart")).format(),
				endtime: moment(vevent.getFirstPropertyValue("dtend")).format(),
				description: vevent.getFirstPropertyValue("description")
			};
		}));
		*/
 
		// HERE NOW, ABOUT TO INPUT INTO DATABASE 
		// Get our form values. These rely on the 'name' attributes
		var eventCategory = event.
		var eventTitle = req.body.eventname;
		var eventType = "Steve";
		var eventStartDate = event.startDate;
		var eventEndDate = event.endDate;

		// Set our collection
		var collection = db.get('usercollection');

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



  // take the input file and insert it into the database, then redirect to the index to redraw the table

  /*

  console.log("\n\njcalData\n\n");
  console.log(jcalData);

  // iterate through the jcalData and insert each vcalendar event into the db

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
      // input the vevents into the mongodb
      // iterate through to insert just 1 event in each 'event' entry... TODO define db structure.
    "event" : jcalData
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // Forward to index page
      res.redirect("/");
    }
  });
    */
  res.redirect("/");
});

/* GET New Event page. */
router.get('/newevent', function(req, res) {
  res.render('newevent', { title: 'Add New Event' });
});

/* POST to Add Event Service */
router.post('/newevent', function(req, res) {

  // Set our internal DB variable
  var db = req.db;
  
  // Get our form values. These rely on the 'name' attributes
  var eventCategory = req.body.eventcategory;
  var eventTitle = req.body.eventname;
  var eventType = req.body.eventtype;
  var eventStartDate = req.body.date_start;
  var eventEndDate = req.body.date_end;

  // Set our collection
  var collection = db.get('usercollection');

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
  
  // Get our form values. These rely on the 'name' attributes
  var documentid = req.body.documentid;

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
