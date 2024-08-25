const db = require("../connection");
const format = require("pg-format");
const endpoints = require("../../endpoints.json");

const selectTopics = () => {
  let queryString = "SELECT * FROM topics";

  return db.query(queryString).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      //console.log(data.rows);

      return data.rows;
    }
  });
};

const selectApi = () => {
  return Promise.resolve(endpoints);
};

module.exports = { selectTopics, selectApi };
