const express = require("express");
const {
  getTopics,
  getArticle,
  getUsers,
} = require("./controllers/newsControllers");
const app = express();

app.get("/api/topics", getTopics);

app.get(`/api/articles/:article_id`, getArticle);

app.get(`/api/users`, getUsers);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404 Page Not Found!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500 Server Error" });
});

module.exports = app;
