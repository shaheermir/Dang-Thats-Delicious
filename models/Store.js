const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const slug = require('slugs')

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
})

storeSchema.pre('save', function(next) {
  console.log('testtt')
  if (!this.isModified('name')) {
    return next()
  }
  //TODO: make slugs unique
  this.slug = slug(this.name)
  next()
})

module.exports = mongoose.model('Store', storeSchema)
