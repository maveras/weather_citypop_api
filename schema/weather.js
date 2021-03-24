const mongoose = require('mongoose')
const {Schema} = mongoose

const weatherSchema = new Schema({
  city: String,
  resWeather: Object,
  cityAlbum: Object
})

module.exports = mongoose.model('Weather', weatherSchema)