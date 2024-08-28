const articles = require("../data/test-data/articles");
const {
  selectTopics,
  selectApi,
  selectArticle,
  selectArticles,
  selectCommentByArticle,
  insertCommentByArticle,
} = require("../Models/news.models");

const getTopics = (request, response, next) => {
  selectTopics()
    .then((rows) => {
      response.status(200).send({ topics: rows });
    })
    .catch((err) => {
      next(err);
    });
};

const getApi = (request, response, next) => {
  selectApi()
    .then((endpointData) => {
      response.status(200).send(endpointData);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticle = (request, response, next) => {
  const article_id = request.params.article_id;

  selectArticle(article_id)
    .then((data) => {
      //   console.log(data);
      response.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  selectArticles()
    .then((data) => {
      response.status(200).send(data);
      //   console.log(data);
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentByArticle = (request, response, next) => {
  const article_id = request.params.article_id;

  selectCommentByArticle(article_id)
    .then((data) => {
      //   console.log(data);
      response.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticle = (request, response, next) => {
  const article_id = request.params.article_id;
  const { body } = request; //body is the entire comment

  insertCommentByArticle(article_id, body) //const body = request.body
    .then((data) => {
      //.send method passes the data as json (if arr or obj)
      response.status(201).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getCommentByArticle,
  postCommentByArticle,
};
