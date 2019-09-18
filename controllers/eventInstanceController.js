var eventInstanceModel = require('../models/eventInstanceModel')
var organizationModel = require('../models/organizationModel')
var Moment = require('moment')

const { body, validationResult } = require('express-validator')
const { sanitizeBody } = require('express-validator')

// POST CREATE an event
exports.eventInstance_create = [
  // Validate fields
  body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
  body('dtstart', 'Start Date must not be empty.').isLength({ min: 1 }).trim(),
  body('dtend', 'End Date must not be empty.').isLength({ min: 1 }).trim(),
  body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),

  // Sanitize fields
  sanitizeBody('*').escape(),

  (req, res, next) => {
    // TODO validate and sanitize input
    var eventInstance = new eventInstanceModel({
      category: req.body.eventCategory,
      summary: req.body.eventTitle,
      type: req.body.eventType,
      organization: req.body.eventOrganization,
      dtstart: Moment(req.body.eventStartDate).startOf('days'),
      dtend: Moment(req.body.eventEndDate).startOf('days'),
      location: req.body.eventLocation,
    })

    eventInstance.save(function (err) {
      if (err) { return next(err) }
      // Successful - redirect 
      res.redirect(eventInstance.url)
    })
  }
]

// GET READ a list of all events
exports.eventInstance_list = function (req, res, next) {
  eventInstanceModel.find()
    .populate({ path: 'organization', select: "name orgShortId" })
    .exec(function (err, list_eventInstances) {
        if (err) { return next(err) }
        // Render if success
        res.send(list_eventInstances)
    })
}

// GET READ information about a particular event
exports.eventInstance_detail = function (req, res, next) {
  eventInstanceModel.findById(req.params.id)
    .exec(function (err, eventInstance) {
      if (err) { return next(err) }
      if (eventInstance === null) { // No results
        var err = new Error('Event not found')
        err.status = 404
        return next(err)
      }
    res.send(eventInstance)
    })
}

// PUT UPDATE an event
exports.eventInstance_update = [
  // Validate fields
  body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
  body('dtstart', 'Start Date must not be empty.').isLength({ min: 1 }).trim(),
  body('dtend', 'End Date must not be empty.').isLength({ min: 1 }).trim(),
  body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),

  // Sanitize fields
  sanitizeBody('*').escape(),
  (req, res, next) => {
    var eventInstance = new eventInstanceModel({
      category: req.body.eventCategory,
      summary: req.body.eventTitle,
      type: req.body.eventType,
      organization: req.body.eventOrganization,
      dtstart: Moment(req.body.eventStartDate).startOf('days'),
      dtend: Moment(req.body.eventEndDate).startOf('days'),
      location: req.body.eventLocation,
      _id: req.body.eventId,
    })
    eventInstanceModel.findByIdAndUpdate(req.body.eventId, eventInstance, {}, function (err, updatedEventInstance) {
      if (err) { return next(err) }
      // Success - redirect to the detail page
      res.send(updatedEventInstance)
    })
  }
]

// DELETE an event
exports.eventInstance_delete = function (req, res, next) {
  eventInstanceModel.findByIdAndRemove(req.body.documentid, function deleteEventInstance (err) {
    if (err) { return next(err) }
    // Success redirect to event list
    res.send({ title: 'delete success' })
  })
}
