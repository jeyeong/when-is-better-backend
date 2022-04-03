const express = require("express");
const cors = require("cors");

// Postgres
const { pool } = require("./config/config");

// App config
const app = express();
const port = process.env.PORT || 8001;

const event = require("./models/event");
const response = require("./models/response")

// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

// API endpoints
app.get("/", (req, res) => res.status(200).send("when-is-better API"));

app.post("/event", (req, res) => {
  event.createEvent(req.body)
    .then(result => {
      switch (result.code) {
        case "SUCCESS":
          res.status(200).json(result);
          return
        case "MISSING_FIELDS":
          res.status(200).json(result);
          return
        case "DB_ERROR":
          res.status(200).json(result);
          return
        default:
          res.status(500);
          return
      }
  });
});

app.get("/event/:event_id", (req, res) => {
  // event.getEventById(req.params.event_id)
  event.getEventWithResponses(req.params.event_id)
    .then(result => {
      switch (result.code) {
        case "SUCCESS":
          res.status(200).json(result)
          return
        case "DB_ERROR":
          res.status(200).json(result)
          return
        case "EVENT_NOT_FOUND":
          res.status(200).json(result)
          return
        default:
          res.status(500);
          return
      }
    })
})

app.post("/response", (req, res) => {
  response.createResponse(req.body)
    .then(result => {
      switch (result.code) {
        case "SUCCESS":
          res.status(200).json(result);
          return
        case "MISSING_FIELDS":
          res.status(200).json(result);
          return
        case "DB_ERROR":
          res.status(200).json(result);
          return
        default:
          res.status(500);
          return
      }
  });
})

app.get("/test-db-insert", (req, res) => {
  query = `INSERT INTO event (event_id, creator, event_name, description,
  available_times, time_interval_min) VALUES 
  ('abcfgh', 'Jack', 'Event2', 'Description of event 1', null, null)`;
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json({ code: "SUCCESS" });
  });
});

app.get("/test-db-select", (req, res) => {
  pool.query("SELECT * FROM test", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Listener
app.listen(port, () => console.log(`Listening. Port: ${port}`));

module.exports = app;
