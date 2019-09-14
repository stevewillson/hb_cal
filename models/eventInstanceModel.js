// Event Instance Model for use with hb_cal

// Require Mongoose
var Mongoose = require('mongoose')
var Moment = require('moment')

var Schema = Mongoose.Schema

var eventInstanceSchema = new Schema({
  dtstart: { type: Date, required: true },
  dtend: { type: Date, required: true },
  dtstamp: { type: Date },
  organizer: { type: String },
  organization: { type: Schema.ObjectId, ref: 'Organization' },
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
  return Moment(this.dtstart).format('YYYY-MM-DD')
})

// Virtual for event start date
eventInstanceSchema
.virtual('endDate')
.get(function () {
  return Moment(this.dtend).format('YYYY-MM-DD')
})

// Virtual for event URL
eventInstanceSchema
.virtual('url')
.get(function () {
  return '/api/event/' + this._id
})

// Export the event model
module.exports = Mongoose.model('eventInstanceModel', eventInstanceSchema)
