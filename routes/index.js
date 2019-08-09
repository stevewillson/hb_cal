var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{sort: {category: 1, date_start: 1}},function(e,docs){
    res.render('index', {
      "title": "Horseblanket Calendar",
      "events" : docs
    });
  });
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

/* POST to Add Event Service */
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
