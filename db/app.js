const express = require("express");
const app = express();
app.use(express.json());

const {
  getTopics,
  getApi,
  getArticle,
} = require("../db/Controllers/news.controllers");

const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/index");

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticle);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
