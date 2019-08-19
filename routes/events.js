var express = require('express');
var router = express.Router();

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

module.exports = router;
