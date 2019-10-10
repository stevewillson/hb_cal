// Organization Model for use with hb_cal

// Require Mongoose
var Mongoose = require('mongoose')

var Schema = Mongoose.Schema

var organizationSchema = new Schema({
  orgDateCreated: { type: Date },
  orgName: { type: String },
  orgShortId: { type: String },
  orgType: { type: String },
})

// Virtual for event URL
organizationSchema
.virtual('url')
.get(function () {
  return '/api/organization/' + this._id
})

// Export the event model
module.exports = Mongoose.model('organizationModel', organizationSchema)
