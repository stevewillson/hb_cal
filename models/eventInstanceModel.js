// Event Instance Model for use with hb_cal

// Require Mongoose
var Mongoose = require('mongoose')
var { DateTime } = require('luxon')

var Schema = Mongoose.Schema

var eventInstanceSchema = new Schema({
  dtstart: { type: Date, required: true },
  dtend: { type: Date, required: true },
  dtstamp: { type: Date },
  organizer: { type: String },
  // just get the name of the organization
  organization: [{ type: 'ObjectId', ref: 'organizationModel' }],
  description: { type: String },
  location: { type: String },
  summary: { type: String },
  category: { type: String },
  type: { type: String },
})

/*
// Virtual for event length
eventInstanceSchema
.virtual('length')
.get(function () {
  return (this.dtend - this.dtstart).toString()
})
*/

// Virtual for event start date
eventInstanceSchema
.virtual('startDate')
.get(function () {
  return DateTime.fromISO(this.dtstart).toFormat('yyyy-MM-dd')
})

// Virtual for event start date
eventInstanceSchema
.virtual('endDate')
.get(function () {
  return DateTime.fromISO(this.dtend).toFormat('yyyy-MM-dd')
})

// Virtual for event URL
eventInstanceSchema
.virtual('url')
.get(function () {
  return '/api/event/' + this._id
})

// Export the event model
module.exports = Mongoose.model('eventInstanceModel', eventInstanceSchema)
