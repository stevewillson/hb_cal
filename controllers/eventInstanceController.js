var eventInstanceModel = require('../models/eventInstanceModel')
var Moment = require('moment')

// POST CREATE an event
exports.eventInstance_create = [
  // res.send('NOT IMPLEMENTED: event create')
  // res.send('NOT IMPLEMENTED: event create')
  (req, res, next) => {
    // TODO validate and sanitize input
    var eventInstance = new eventInstanceModel({
      category: req.body.eventCategory,
      summary: req.body.eventTitle,
      type: req.body.eventType,
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
exports.eventInstance_list = function (req, res) {
  eventInstanceModel.find()
    .exec(function (err, list_eventInstances) {
        if (err) { return next(err) }
        // Render if success
        res.send(list_eventInstances)
    })
}

// GET READ information about a particular event
exports.eventInstance_detail = function (req, res) {
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
  (req, res, next) => {
    var eventInstance = new eventInstanceModel({
      category: req.body.eventCategory,
      summary: req.body.eventTitle,
      type: req.body.eventType,
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
exports.eventInstance_delete = function (req, res) {
  eventInstanceModel.findByIdAndRemove(req.body.documentid, function deleteEventInstance (err) {
    if (err) { return next(err) }
    // Success redirect to event list
    res.redirect('/api/event')
  })
}
