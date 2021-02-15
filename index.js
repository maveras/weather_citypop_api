const express = require('express')
const app = express()
const weatherApi = require('./routes/weather')
const {errorHandler, logErrors, wrapErrors} = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')

app.use(express.json())

//routes
weatherApi(app)


// algApi(app)

// catch 404
app.use(notFoundHandler)

// Errors middleware
app.use(wrapErrors)
app.use(errorHandler)
app.use(logErrors)

app.listen(5000, () => {
  console.log('app listen at port 5000')
})