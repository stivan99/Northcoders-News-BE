const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getCommentByArticle,
  postCommentByArticle,
  patchArticle,
  deleteComment,
  getUsers,
} = require("../db/Controllers/news.controllers");

const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/index");

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentByArticle);
app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

//app.all("*", notFoundHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
