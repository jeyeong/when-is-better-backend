const { DateTime } = require("luxon");
const res = require("express/lib/response");
const luxon = require("luxon")
const { pool } = require("../config/config");
const { response } = require("../server");

/*
 * response data format:
 * {
 *   name - user's name
 *   comments - comments given by user
 *   event_id - event associated with the response
 *   selected_times - array of times in HTTP format
 *   time_interval_min - time interval for selected times in minutes
 *
 * }
 */
exports.createResponse = async (response) => {
  const required_fields = [
    "name",
    "selected_times",
    "event_id",
    "time_interval_min",
  ];
  for (f of required_fields) {
    if (!(f in response)) {
      return { code: "MISSING_FIELDS" };
    }
  }


  const available_times = response.selected_times.map(time_http =>
    DateTime.fromHTTP(time_http)
  );

  const query = `INSERT INTO response (name, comments, selected_times, time_interval_min,
  event) 
  VALUES 
  ($1, $2, $3, $4, $5)`;
  const values = [
    response.name,
    response.comments,
    response.selected_times,
    response.time_interval_min,
    response.event_id,
  ];

  return pool
    .query(query, values)
    .then(res => {return {code: "SUCCESS"}})
    .catch(err => {console.log(err); return { code: "DB_ERROR"}})
};

exports.responseSQLtoObj = resp => {
    const http_times = resp.selected_times.map(time_obj => 
        luxon.DateTime.fromJSDate(time_obj).toHTTP());
    resp.selected_times = http_times;
    return resp
}