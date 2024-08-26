const {
  selectTopics,
  selectApi,
  selectArticle,
  selectArticles,
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
      //   console.log(data);
      response.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getApi, getArticle, getArticles };
