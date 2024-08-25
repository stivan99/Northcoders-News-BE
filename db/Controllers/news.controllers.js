const { selectTopics } = require("../Models/news.models");

const getTopics = (request, response, next) => {
  selectTopics()
    .then((rows) => {
      response.status(200).send({ topics: rows });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
