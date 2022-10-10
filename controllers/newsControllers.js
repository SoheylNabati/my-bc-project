const { fetchTopics } = require("../models/newsModels");
exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    console.log(topics);
    return res.status(200).send({ topics });
  });
};
