var express = require('express');
var router = express.Router();

/* GET New Event page. */
router.get('/event', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{sort: {category: 1, date_start: 1}},function(e,docs){
    res.status(200).send({
      "title": "all events",
      "events" : docs
    });
  });
});


/* POST to Add a Single Event Service */
router.post('/event', function(req, res) {

  // Set our internal DB variable
  var db = req.db;
  // Set our collection
  var collection = db.get('usercollection');

  var eventCategory = "";
  var eventTitle = "";
  var eventType = "";
  var eventStartDate = "";
  var eventEndDate = "";
 		
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
