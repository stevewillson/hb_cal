var organizationModel = require('../models/organizationModel')
var { DateTime } = require('luxon')

// POST CREATE an organization
exports.organization_create = [
  (req, res, next) => {
    // TODO validate and sanitize input
    var organization = new organizationModel({
      orgName: req.body.orgName,
      orgType: req.body.orgType,
      orgDateCreated: DateTime.fromISO(req.body.orgDateCreated).startOf('days'),
      orgShortId: req.body.orgShortId,
    })

    organization.save(function (err) {
      if (err) { return next(err) }
      // Successful - redirect 
      res.redirect(organization.url)
    })
  }
]

// GET READ a list of all organizations
exports.organization_list = function (req, res, next) {
  organizationModel.find()
    .exec(function (err, list_organizations) {
        if (err) { return next(err) }
        // Render if success
        res.send(list_organizations)
    })
}

// GET READ information about a particular organization
exports.organization_detail = function (req, res, next) {
  organizationModel.findById(req.params.id)
    .exec(function (err, organization) {
      if (err) { return next(err) }
      if (organization === null) { // No results
        var err = new Error('Organization not found')
        err.status = 404
        return next(err)
      }
    res.send(organization)
    })
}

// PUT UPDATE an organization
exports.organization_update = [
  (req, res, next) => {
    var organization = new organizationModel({
      orgName: req.body.orgName,
      orgType: req.body.orgType,
      orgDateCreated: DateTime.fromISO(req.body.orgDateCreated).startOf('days'),
      orgShortId: req.body.orgShortId,
      _id: req.body.orgId,
    })
    organizationModel.findByIdAndUpdate(req.body.orgId, organization, {}, function (err, updatedOrganization) {
      if (err) { return next(err) }
      // Success - redirect to the detail page
      res.send(updatedOrganization)
    })
  }
]

// DELETE an organization
exports.organization_delete = function (req, res, next) {
  organizationModel.findByIdAndRemove(req.body.orgId, function deleteOrganization (err) {
    if (err) { return next(err) }
    // Success redirect to organization list
    res.redirect('/api/organization')
  })
}
