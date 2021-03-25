require('dotenv').config();
const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  weatherKey: process.env.WEATHER_KEY,
  discogSecret: process.env.DISCOG_SECRET,
  discogKey: process.env.DISCOG_KEY,
  mapBoxToken: process.env.MAPBOX_TOKEN
}

module.exports = {config}