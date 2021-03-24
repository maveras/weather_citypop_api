const fetch = require('node-fetch')
const { config } = require('../config')
const Weather = require('../schema/weather')


const weatherServices = () => {
  let collection = ''
  config.dev ? collection = 'weatherDev' : 'weather'

  const apiWeather = async (city) => {
    const lowerCity = city.toLowerCase()
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${lowerCity}&appid=${config.weatherKey}`)
    const apiWeather = res.json()
    return apiWeather || {}
  }

  const createWeather = async (city) => {
    const resWeather = await apiWeather(city)
    const cityALbum = await getCityPopSong()
    const weather = new Weather({
      city,
      resWeather,
      cityALbum
    })
    console.log('weather', weather)
    const qwea = await weather.save()
    console.log('q wea', qwea)
    const createdWeatherId = 'asklñdjalsk'
    return {createdWeatherId, resWeather, cityALbum}
  }

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

  return {
    createWeather
  }
}


module.exports = weatherServices