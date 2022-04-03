const { DateTime } = require('luxon');
const res = require("express/lib/response");
const { pool } = require("../config/config");
const response = require("./response")
const luxon = require('luxon')
let crypto = require('crypto')

/* event data format: 
 * {
 *   host - the event creator's name
 *   name - the event name
 *   description - event description
 *   available_times - list of times available for the event
 *   time_interval_min - length of each time interval in minutes
 * }
 */
exports.createEvent = (event) => {
  const required_fields = ['creator', 'available_times', 'time_interval_min', 'time_start', 'time_end']
  for (f of required_fields) {
    if (!(f in event)) {
      return new Promise({ code: "MISSING_FIELDS" })
    }
  }
  
  event.event_id = crypto.randomBytes(3).toString('hex'); // creates 6 character random string

  const available_times = event.available_times.map(row => row.map(time_http => DateTime.fromHTTP(time_http).toISO()))

  const query = `INSERT INTO event (event_id, creator, event_name, description,
  available_times, time_interval_min, time_start, time_end) 
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [event.event_id, event.creator, event.event_name, event.description,
            JSON.stringify(available_times), event.time_interval_min, event.time_start, event.time_end]
  
  return pool
    .query(query, values)
    .then(res => {return {code: "SUCCESS", event_id: event.event_id}})
    .catch(err => {console.log(err); return { code: "DB_ERROR"}})
};

const timeObjToHTTP = time => luxon.DateTime.fromJSDate(time).toHTTP()

const timeISOToHTTP = time => luxon.DateTime.fromISO(time).toHTTP()

exports.getEventById = (event_id) => {
  const query = `SELECT * FROM event WHERE event_id = $1`
  return pool.query(query, [event_id])
    .then(res => {
      if (res.rows.length == 0) {
        return { code: "EVENT_NOT_FOUND"}
      }
      const event = res.rows[0];

      const available_times = event.available_times.map(day => day.map(time_obj => 
        timeISOToHTTP(time_obj))
      )
      event.available_times = available_times
      event.time_start = timeObjToHTTP(event.time_start)
      event.time_end = timeObjToHTTP(event.time_end)

      return {code: "SUCCESS", event}
    }).catch(err => {console.log(err); return { code: "DB_ERROR" }}) 
}

exports.getEventRequests = event_id => {
  const query = `SELECT * FROM response where event = $1`
  return pool.query(query, [event_id])
    .then(res => {
      return {code: "SUCCESS", response: res.rows.map(resp => response.responseSQLtoObj(resp))}
    }).catch(err => {console.log(err); return {code: "DB_ERROR"}})
}

exports.getEventWithResponses = async event_id => {
  const [event, responses] = await Promise.all([exports.getEventById(event_id), 
                                             exports.getEventRequests(event_id)])
  if (event.code == "SUCCESS" && responses.code == "SUCCESS") {
    return {
      code: "SUCCESS",
      event: event.event,
      responses: responses.response
    }
  } else if (event.code != "SUCCESS") {
    return { code: event.code };
  } else { // responses invalid
    return { code: responses.code};
  }
}