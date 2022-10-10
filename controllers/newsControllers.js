const { fetchTopics, fetchArticle } = require("../models/newsModels");
exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    return res.status(200).send({ topics });
  });
};

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  return fetchArticle(id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};
