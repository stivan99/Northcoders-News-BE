const { selectTopics, selectApi } = require("../Models/news.models");

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

module.exports = { getTopics, getApi };
