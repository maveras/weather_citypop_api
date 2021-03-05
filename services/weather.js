const MongoLib = require('../lib/mongo')
const fetch = require('node-fetch')
const { config } = require('../config')

// class MoviesService {
//   constructor() {
//     this.collection = 'movies'
//     this.mongoDB = new MongoLib()
//   }
//   async getMovies({tags}) {
//     const query = tags && { tags: { $in: tags}}
//     const movies = await this.mongoDB.getAll(this.collection, query)
//     return movies || []
//   }
//   async getMovie({movieId}) {
//     const movie = await this.mongoDB.get(this.collection, movieId)
//     return movie || {}
//   }
//   async createMovie({movie}) {
//     const createdMovieId = await this.mongoDB.create(this.collection, movie)
//     return createdMovieId
//   }
//   async updateMovie({movieId, movie} = {}) {
//     const createdMovieId = await this.mongoDB.update(this.collection, movieId, movie)
//     return createdMovieId
//   }
//   async deleteMovie({movieId}) {
//     const deleteMovie = await this.mongoDB.delete(this.collection, movieId)
//     return deleteMovie
//   }
// }
const weatherServices = () => {
  const collection = 'weather'
  const mongoDB = new MongoLib()

  const getWeather = async ({tags}) => {
    const query = tags && { tags: { $in: tags}}
    const weather = await mongoDB.getAll(collection, query)
    return weather || []
  }

  const apiWeather = async (city) => {
    const lowerCity = city.toLowerCase()
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${lowerCity}&appid=${config.weatherKey}`)
    const apiWeather = res.json()
    return apiWeather || {}
  }

  const createWeather = async (city) => {
    const resWeather = await apiWeather(city)
    const cityALbum = await getCityPopSong()
    const mongoObj = { resWeather, city, cityALbum }
    const createdWeatherId = await mongoDB.create(collection, mongoObj)
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
    getWeather,
    createWeather
  }
}


module.exports = weatherServices