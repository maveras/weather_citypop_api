const mongoose = require('mongoose')
const {Schema} = mongoose
const {config} = require('../config/index')
let collectionName = 'Weather'
config.dev ? collectionName = 'weatherDev' : collectionName
const weatherSchema = new Schema({
  city: String,
  resWeather: Object,
  cityAlbum: Object
})

module.exports = mongoose.model('Weather', weatherSchema, collectionName)