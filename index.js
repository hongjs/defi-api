require('dotenv').config()
const express = require('express')
const apicache = require('apicache')
require('./services/passport')

const app = express()
const cache = apicache.middleware
app.use(express.json())

// Routes
app.use('/auth', require('./routes/authRoute'))
app.use('/nft', cache('1 days'), require('./routes/nftRoute'))
app.use('/quote', require('./routes/quoteRoute'))

app.get('/', (req, res) => {
  res.send(
    '<h1>Defi Finance API</h1><p><a href="https://docs.defifinance.app/resource/api" target="_blank">more info</a>'
  )
})

// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500
  res.status(statusCode)
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`[+] Starting server on port ${PORT}`))
