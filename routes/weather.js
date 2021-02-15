const { json } = require('body-parser')
const express = require('express')
const weatherServices = require('../services/weather')
const validationHandler = require('../utils/middleware/validationHandler')
const { createWeatherSchema } = require('../utils/schemas/weather')
const { log } = require('console')

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
  router.post('/', validationHandler(createWeatherSchema) ,async (req, res, next) => {
    try {
      const city = req.body.city
      const createdWheater = await weatherService.createWeather(city)
      const cityPopSong = await weatherService.getCityPopSong()
      const result = {createdWheater, cityPopSong}
      if (createdWheater.resWeather.cod != 200) {
        res.status(createdWheater.resWeather.cod).json({
          data: {},
          message: "Not found"
        })
      } else {
        res.status(201).json({
          data: result,
          message: "Weather Created"
        })
      }
    } catch (error) {
      next(error)
    }
  })
  // router.get('/citypop', async (req, res, next) => {
  //   try {
  //     const cityPopSong = await weatherService.getCityPopSong()
  //     res.status(201).json({
  //       data: cityPopSong,
  //       message: "listed citi"
  //     })
  //   } catch (error) {
  //     next(error)
  //   }
  // })
}

module.exports = weatherApi