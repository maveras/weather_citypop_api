const { string } = require('@hapi/joi')
const fetch = require('node-fetch')
const { config } = require('../config')
const Weather = require('../models/weather')


const weatherServices = () => {
  let collection = ''
  config.dev ? collection = 'weatherDev' : 'weather'

  const getCityPopSong = async () => {
    const res = await fetch(`https://api.discogs.com/database/search?style=city+pop&key=${config.discogKey}&secret=${config.discogSecret}&page=1&per_page=100`)
    const cityPopRes = await res.json()
    const lastPage = cityPopRes.pagination.pages
    const lastPageResults = await fetch(`https://api.discogs.com/database/search?style=city+pop&key=${config.discogKey}&secret=${config.discogSecret}&page=${lastPage}&per_page=100`)
    const results = await lastPageResults.json()
    const lastResultsArray = results.results
    const randomLastResult = Math.round(Math.random() * lastResultsArray.length - 1)
    const selectedLastResult = lastResultsArray[randomLastResult]

    const mainRandom = Math.round(Math.random() * lastPage)
    if(mainRandom === lastPageResults) {
      return selectedLastResult
    } else {
      const noLastFetch = await fetch(`https://api.discogs.com/database/search?style=city+pop&key=${config.discogKey}&secret=${config.discogSecret}&page=${mainRandom}&per_page=100`)
      const fetchJsoned = await noLastFetch.json()
      const randomFromResult = Math.round(Math.random() * 100)
      const selectedSong = fetchJsoned.results[randomFromResult]
      return selectedSong
    }
  }

  const getCities = async (cityString) => {
    const lowerCity = cityString.toLowerCase()
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lowerCity}.json?access_token=${config.mapBoxToken}`)
    const cities = res.json()
    return cities
  }

  const getWeatherByCoord = async (lat, lon) => {
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&appid=${config.weatherKey}`)
    const apiWeather = res.json()
    return apiWeather || {}
  }

  const createWeather = async (cityObject) => {
    try {
      const {lat, lon, city } = cityObject
      const resWeather = await getWeatherByCoord(lat, lon)
      const cityAlbum = await getCityPopSong()
      const weather = new Weather({
        city,
        resWeather,
        cityAlbum
      })
      await weather.save()
      const createdWeatherId = weather._id
      return {createdWeatherId, resWeather, cityAlbum}
    } catch (error) {
      return error
    }
  }

  return {
    createWeather,
    getCities,
    getWeatherByCoord
  }
}


module.exports = weatherServices