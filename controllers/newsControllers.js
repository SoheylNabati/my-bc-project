const {
  fetchTopics,
  fetchArticle,
  fetchUsers,
  editArticleVotesByID,
  fetchCommentsByArticleID,
} = require("../models/newsModels");
exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    return res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  return fetchArticle(id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  return fetchUsers().then((users) => {
    return res.status(200).send({ users });
  });
};

exports.patchArticleVotesByID = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.body;
  return editArticleVotesByID(article_id, votes)
    .then((updatedArticle) => {
      return res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  return fetchCommentsByArticleID(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
