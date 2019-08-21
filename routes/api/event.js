var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET New Event page. */
router.get('/api/event', function(req, res) {
  var db = req.db;
  var total_col = [];
  var collection = db.get('usercollection');
  collection.find({ vevent: "vevent" },{sort: {category: 1, date_start: 1}},function(err, docs){
    for( var i = 0; i < docs.length; i++ ){

      // check to see what type of event it is
      // 4 options
      // dtms
      // google calendar
      // confluence
      // added by hand

      // -> DTMS Event
      if ( docs[i]["vevent"][1][0][3] == "Unit Training Plan Event" ) {
        event_type = "DTMS";
      }

      // -> Google Calendar Event
      else if ( docs[i]["vevent"][1].length == 15 ) {
        event_type = "Google Calendar";
      }

      // -> Confluence Calendar
      else if ( docs[i]["vevent"][1].length == 22 ) {
        event_type = "Confluence Calendar";
      }
      

      // add check to see if the event was manually added
      //else if ( docs[i]["vevent"] )


      

      //loop through and format the docs appropriately
      try {
        var summary = docs[i]["vevent"][1][13][3];
        var startdate = new moment(docs[i]["vevent"][1][0][3]).format("YYYY-MM-DD"); 
        var enddate = new moment(docs[i]["vevent"][1][1][3]).format("YYYY-MM-DD"); 
        var json_entry = { 
          "summary":summary, 
          "category":"Training", 
          "startdate":startdate, 
          "enddate":enddate };
        total_col.push(json_entry);
      }
      catch (err)  {
      }
    }
    res.status(200).send({
      "hb_cal_events" : total_col
    });
  });
});

/* POST to Add a Single Event Service */
router.post('/api/event', function(req, res) {

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
      res.redirect(".");
    }
  });
});

module.exports = router;
