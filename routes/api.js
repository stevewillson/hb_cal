var express = require('express')
var router = express.Router()

const fetch = require('node-fetch')

var eventInstanceController = require('../controllers/eventInstanceController')
var organizationController = require('../controllers/organizationController')

// THIS IS THE 'API' router, all URLs will be prefixed with 'api' from app.js

// CREATE Event
router.post('/event', eventInstanceController.eventInstance_create)

// READ Event
router.get('/event', eventInstanceController.eventInstance_list)

// READ information about a particular event
router.get('/event/:id', eventInstanceController.eventInstance_detail)

// READ information about a particular event that has a organization
router.get('/event/organization/:organization_id', eventInstanceController.eventInstance_org_detail)

// UPDATE Event
router.put('/event', eventInstanceController.eventInstance_update)

// DELETE Event
router.delete('/event', eventInstanceController.eventInstance_delete)



// CREATE organization
router.post('/organization', organizationController.organization_create)

// READ organization
router.get('/organization', organizationController.organization_list)

// READ information about a particular organization
router.get('/organization/:id', organizationController.organization_detail)

// UPDATE organization
router.put('/organization', organizationController.organization_update)

// DELETE organization
router.delete('/organization', organizationController.organization_delete)

module.exports = router
