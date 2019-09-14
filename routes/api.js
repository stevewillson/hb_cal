var express = require('express')
var router = express.Router()

const fetch = require('node-fetch')

var eventInstanceController = require('../controllers/eventInstanceController')

// THIS IS THE 'API' router, all URLs will be prefixed with 'api' from app.js

// CREATE
router.post('/event', eventInstanceController.eventInstance_create)

// READ
router.get('/event', eventInstanceController.eventInstance_list)

// READ information about a particular event
router.get('/event/:id', eventInstanceController.eventInstance_detail)

// UPDATE
router.put('/event', eventInstanceController.eventInstance_update)

// DELETE
router.delete('/event', eventInstanceController.eventInstance_delete)

module.exports = router
