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

const insertCommentByArticle = (article_id, body) => {
  // console.log(body); //body is the comment we want to add
  if (!body.body || !body.author || !body.article_id) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((output) => {
      if (output.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article doesn not exist" });
      }

      const commentValues = Object.values(body);
      // console.log(commentValues);

      let queryString = `INSERT INTO comments (body, votes, author, article_id) VALUES (%L) RETURNING *`;
      const formatString = format(queryString, commentValues);

      return db.query(formatString).then((data) => {
        // console.log(data.rows);
        return data.rows[0];
      });
    });
};

const updateVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!article_id) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (typeof article_id !== "number") {
    article_id = Number(article_id);
  }

  let queryString = `SELECT * FROM articles WHERE article_id = $1`;
  let queryValues = [article_id];

  return db
    .query(queryString, queryValues)
    .then((data) => {
      // console.log(data.rows);
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }

      let newQueryString = `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`;
      let newQueryValues = [inc_votes, article_id];

      return db.query(newQueryString, newQueryValues);
    })
    .then((result) => {
      return result.rows[0];
    });
};

const deleteCommentById = (comment_id) => {
  comment_id = Number(comment_id);
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let queryString = `DELETE FROM comments 
  WHERE comment_id = $1
  RETURNING *`;
  let queryValue = [comment_id];

  return db.query(queryString, queryValue).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Comment_id does not exist" });
    }
    //console.log(result);

    return result;
  });
};

module.exports = {
  selectTopics,
  selectApi,
  selectArticle,
  selectArticles,
  selectCommentByArticle,
  insertCommentByArticle,
  updateVotes,
  deleteCommentById,
};

// alternative to pg-formating
// const queryString = `INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *`;
// const commentValues = [body.body, body.votes, body.author, article_id];
// return db.query(queryString, commentValues).then((data) => {
//   return data.rows[0];
// });
