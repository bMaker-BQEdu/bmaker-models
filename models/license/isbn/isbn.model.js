import { Schema, model } from 'mongoose'

const ISBNSchema = new Schema({
  code: String,
  level: Number,
  projects: [ Number ],
  seats: Number,
  expiration: Number,
  kind: String,
  language: String
}, {
  _id: false // Ignore _id field when using ISBNs as subdocuments
})

// Indexes
ISBNSchema.index({ code: 1 }, { unique: true })
const ISBN = model('ISBN', ISBNSchema)

export { ISBN, ISBNSchema }
