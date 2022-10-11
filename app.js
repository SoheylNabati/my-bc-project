const express = require("express");
const { getTopics, getArticle } = require("./controllers/newsControllers");
const {
  invalidEndpoint,
  serverError,
  PSQLerrors,
  costumError,
} = require(`./controllers/errorHandling.controller`);

const app = express();
// app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles/:article_id`, getArticle);

app.all("*", invalidEndpoint);
app.use(costumError);
app.use(PSQLerrors);
app.use(serverError);

module.exports = app;
