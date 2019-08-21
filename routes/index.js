var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{sort: {category: 1, date_start: 1}},function(e,docs){
		// add things here to massage the mongodb data so it is consistent for the calendar?
		var events = [];
		var event_type = '';
		for (i = 0; i< docs.length; i++) {
			event_type = '';
			try {
				// -> DTMS Event
				if ( docs[i]["vevent"][1][0][3] == "Unit Training Plan Event" ) {
					event_type = "DTMS_Calendar";
				}

				// -> Google Calendar Event
				else if ( docs[i]["vevent"][1].length == 15 ) {
					event_type = "Google_Calendar";
				}

				// -> Confluence Calendar
				else if ( docs[i]["vevent"][1].length == 22 ) {
					event_type = "Confluence_Calendar";
				}
				// -> Hand Entry Calendar
				else if ( docs[i]["vevent"][1].length == 5 ) {
					event_type = "Hand_Entry_Calendar";
				}
			}
			catch (err) {
				event_type = "Unknown";
			}

			var eventCategory = '';
			var eventType = '';
			var eventSummary = '';
			var eventStartDate = '';
			var eventEndDate = '';

			if ( event_type == "DTMS_Calendar" ) {
				eventSummary = docs[i]["vevent"][1][8][3];
				eventCategory = docs[i]["vevent"][1][0][3];
				eventStartDate = new moment(docs[i]["vevent"][1][5][3]).format("YYYY-MM-DD"); 
				eventEndDate = new moment(docs[i]["vevent"][1][3][3]).format("YYYY-MM-DD"); 
			}

			if ( event_type == "Google_Calendar" ) {
				eventSummary = docs[i]["vevent"][1][13][3];
				eventStartDate = new moment(docs[i]["vevent"][1][0][3]).format("YYYY-MM-DD"); 
				eventEndDate = new moment(docs[i]["vevent"][1][1][3]).format("YYYY-MM-DD"); 
			}

			if ( event_type == "Confluence_Calendar" ) {
				eventSummary = docs[i]["vevent"][1][3][3];
				eventCategory = docs[i]["vevent"][1][10][3];
				eventStartDate = new moment(docs[i]["vevent"][1][1][3]).format("YYYY-MM-DD"); 
				eventEndDate = new moment(docs[i]["vevent"][1][2][3]).format("YYYY-MM-DD"); 
			}

			if ( event_type == "Hand_Entry_Calendar" ) {
				eventSummary = docs[i]["vevent"][1][0][3];
				eventCategory = docs[i]["vevent"][1][1][3];
				eventType = docs[i]["vevent"][1][2][3];
				eventStartDate = new moment(docs[i]["vevent"][1][3][3]).format("YYYY-MM-DD"); 
				eventEndDate = new moment(docs[i]["vevent"][1][4][3]).format("YYYY-MM-DD"); 
			}


			var new_event = { "eventSummary": eventSummary, "eventCategory": eventCategory,
				"eventType": eventType, "eventStartDate":eventStartDate, "eventEndDate":eventEndDate, "eventImportType": event_type, "_id": docs[i]._id };
			events.push(new_event);
		}

    res.render('index', {
      "title": "Horseblanket Calendar",
      "events" : events,
      "moment" : moment,
      "cal_view" : req.cookies
    });
  });
});

/* POST to Set Begin and End of Calendar Display */
router.post('/', function(req, res) {

  // the req.fields object contains the POST values
  var beginDate = req.fields.datebegin;
  var endDate = req.fields.dateend;
  var cell_width = req.fields.cell_width;
  res.cookie("beginDate", beginDate, {expire : new Date() + 9999});
  res.cookie("endDate", endDate, {expire : new Date() + 9999});
  res.cookie("cell_width", cell_width, {expire : new Date() + 9999});

  // Forward to index page
  res.redirect(".");
});
  
module.exports = router;
