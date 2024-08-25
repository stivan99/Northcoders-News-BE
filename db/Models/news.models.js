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

const selectArticle = (article_id) => {
  let queryString = `SELECT * FROM articles`;
  let queryValues = [];
  //   console.log(article_id);
  if (Number(article_id)) {
    queryString += ` WHERE article_id = $1`;
    queryValues.push(Number(article_id));
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  //   console.log(queryString);
  return db.query(queryString, queryValues).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      return data.rows[0];
    }
  });
};

module.exports = { selectTopics, selectApi, selectArticle };
