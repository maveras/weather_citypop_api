const joi = require('@hapi/joi')

const weatherIdSchema = joi.string().regex(/ˆ[0-9a-fA-f]{24}$/)
const weatherCitySchema = joi.string().max(100)

const createWeatherSchema = {
  city: weatherCitySchema.required()
}

module.exports = {
  weatherIdSchema,
  createWeatherSchema
}