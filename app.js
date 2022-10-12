const express = require("express");
const {
  getTopics,
  getArticleById,
  getUsers,
  patchArticleVotesByID,
} = require("./controllers/newsControllers");
const {
  invalidEndpoint,
  serverError,
  PSQLerrors,
  customError,
} = require(`./controllers/errorHandling.controller`);

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/users`, getUsers);
app.patch(`/api/articles/:article_id`, patchArticleVotesByID);

app.all("*", invalidEndpoint);
app.use(customError);
app.use(PSQLerrors);
app.use(serverError);

module.exports = app;
