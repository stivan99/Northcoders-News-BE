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
  let queryString = `SELECT * FROM articles `;
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
const selectArticles = () => {
  let queryString = ` SELECT 
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`;

  return db.query(queryString).then((data) => {
    // console.log(data);

    if (data.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      return data.rows;
    }
  });
};
const selectCommentByArticle = (article_id) => {
  let queryString = `SELECT * FROM comments`;
  let queryValues = [];

  if (Number(article_id)) {
    queryString += ` WHERE article_id = $1`;
    queryValues.push(Number(article_id));
    queryString += `ORDER BY created_at DESC`;
    // console.log(queryString);
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db.query(queryString, queryValues).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      return data.rows;
    }
  });
};

module.exports = {
  selectTopics,
  selectApi,
  selectArticle,
  selectArticles,
  selectCommentByArticle,
};
