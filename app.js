const express = require("express");
const { getTopics } = require("./controllers/newsControllers");
const app = express();

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "404 page not found!" });
});

module.exports = app;
