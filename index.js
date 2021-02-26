const express = require('express')
const app = express()
const weatherApi = require('./routes/weather')
const {errorHandler, logErrors, wrapErrors} = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')
const cors = require('cors')

const {config} = require('./config/index')
app.use(express.json())

const allowedOrigins = ['weather-citypop-api-front-git-main-mavera.vercel.app'];

if(config.dev) {
  allowedOrigins.push('http://localhost:3000')
}
app.use(cors(
  {
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }
));
//routes
weatherApi(app)


// algApi(app)

// catch 404
app.use(notFoundHandler)

// Errors middleware
app.use(wrapErrors)
app.use(errorHandler)
app.use(logErrors)
const port = config.port || 80
app.listen(port, () => {
  console.log(`app listen at port ${port}`)
})