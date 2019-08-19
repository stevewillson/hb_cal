var express = require('express');
var router = express.Router();

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
