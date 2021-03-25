const express = require('express')
const weatherServices = require('../services/weather')
const validationHandler = require('../utils/middleware/validationHandler')
const { createWeatherSchema } = require('../utils/schemas/weather')
const formatCities = require('../utils/helpers/cities')


const weatherApi = (app) => {
  const router = express.Router();
  app.use('/api/weather', router);
  const weatherService = weatherServices()
  router.get('/', async (req, res, next) => {
    // const { tags } = req.query;
    // try {
    //   const weather = await weatherService.getWeather({tags})
    //   res.status(200).json({
    //     data: weather,
    //     message: 'movie listed'
    //   })
    // } catch (error) {
    //   next(error)
    // }
  })

  router.get('/getCities', async(req, res, next) => {
    const city = req.query.name;
    const cities = await weatherService.getCities(city)
    const formatedCities = formatCities(cities.features)
    res.status(200).json(formatedCities)
  })

  router.post('/', validationHandler(createWeatherSchema) ,async (req, res, next) => {
    try {
      const cityObject = req.body.city
      const createdWeather = await weatherService.createWeather(cityObject)
      if (createdWeather.resWeather.cod !== 200) {
        res.status(createdWeather.resWeather.cod).json({
          data: {},
          message: "Not found"
        })
      } else {
        const cityAlbum = createdWeather.cityAlbum
        const result = {createdWeather, cityAlbum}
        res.status(201).json({
          data: result,
          message: "Weather Created"
        })
      }
    } catch (error) {
      next(error)
    }
  })
}

module.exports = weatherApi