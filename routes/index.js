var express = require('express');
var router = express.Router();
var moment = require('moment');

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
