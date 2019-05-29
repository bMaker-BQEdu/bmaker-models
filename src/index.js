var ISBNSchema = require('./models/license/isbn/isbn.model')
var LicenseSchema = require('./models/license/license/license.model')

exports.printMsg = function () {
  console.log('This is a message from the demo package')
}

exports.ISBNSchema = ISBNSchema
exports.LicenseSchema = LicenseSchema
