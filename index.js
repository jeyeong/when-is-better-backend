const express = require('express')
const cors = require('cors')

// Postgres
const { pool } = require('./config/config')

// App config
const app = express()
const port = process.env.PORT || 8001

// Middlewares
app.use(express.json())
app.use(cors({ origin: '*' }))

// API endpoints
app.get('/', (req, res) => res.status(200).send('when-is-better API'))

app.get('/test-db-insert', (req, res) => {
  pool.query('INSERT INTO test VALUES (1)', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json({ code: 'SUCCESS' })
  })
})

app.get('/test-db-select', (req, res) => {
  pool.query('SELECT * FROM test', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`))
