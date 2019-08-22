var express = require('express')
var router = express.Router()

/* POST to Delete Event Service */
router.post('/delevent', function (req, res) {
  // Set our internal DB variable
  var db = req.db

  // Get our form values. These rely on the 'name' attributes
  var documentid = req.fields.documentid

  // Set our collection
  var collection = db.get('usercollection')

  // Submit to the DB
  collection.remove({
    _id: documentid
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send('There was a problem removing the information to the database.')
    } else {
      // And forward to success page
      res.redirect('.')
    }
  })
})

module.exports = router
