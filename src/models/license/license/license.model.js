var handleValidationError = require('../utils')
var ISBNSchema = require('../isbn/isbn.model')
var mongoose = require('mongoose')

var Schema = mongoose.Schema

/**
 * License schema
 */
var LicenseSchema = new Schema({
  hash: String,
  ISBN: {
    type: ISBNSchema,
    required: true
  },
  classroom: Schema.Types.ObjectId,
  requestId: {
    type: Number,
    required: true
  },
  expireAt: Date,
  used: {
    type: Boolean,
    default: false
  },
  activatedAt: Date,
  deactivated: Boolean,
  deactivatedAt: Date,
  reason: String,
  deleted: Boolean
}, {
  timestamps: true
})

/**
 * Indexes
 */
// Override subdocument indexes
LicenseSchema.indexes = function () {
  return LicenseSchema._indexes
}
// Index on license code
LicenseSchema.index({ 'hash': 1 }, { unique: true })

// Index on requestId
LicenseSchema.index({ 'requestId': 1 })

// Pre hooks
function findNotDeletedMiddleware (next) {
  this.where('deleted').in([false, undefined, null])
  next()
}

LicenseSchema.pre('find', findNotDeletedMiddleware)
LicenseSchema.pre('findOne', findNotDeletedMiddleware)
LicenseSchema.pre('findOneAndUpdate', findNotDeletedMiddleware)
LicenseSchema.pre('count', findNotDeletedMiddleware)

function hideUsername (next) {
  this.select('-userVIP')
  next()
}

LicenseSchema.pre('find', hideUsername)
LicenseSchema.pre('findOne', hideUsername)
LicenseSchema.pre('findOneAndUpdate', hideUsername)
LicenseSchema.pre('count', hideUsername)

/**
 * Post hooks
 */
LicenseSchema.post('validate', handleValidationError)
LicenseSchema.post('findOneAndUpdate', handleValidationError)

module.exports.LicenseSchema = LicenseSchema
