const express = require("express");
const { getTopics } = require("./controllers/newsControllers");
const app = express();

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "404 Page Not Found!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500 Server Error" });
});

module.exports = app;
