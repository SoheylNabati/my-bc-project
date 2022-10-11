const { fetchTopics } = require("../models/newsModels");
exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    return res.status(200).send({ topics });
  });
};
