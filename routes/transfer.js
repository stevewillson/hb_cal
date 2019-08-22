var express = require('express')
var router = express.Router()

/* GET transfer page. */
router.get('/transfer', function (req, res) {
  res.render('transfer', {
    title: 'Transfer Page'
  })
})

module.exports = router
