const joi = require('@hapi/joi')

const weatherCitySchema = joi.object()

const createWeatherSchema = {
  city: weatherCitySchema.required()
}

module.exports = {
  createWeatherSchema
}