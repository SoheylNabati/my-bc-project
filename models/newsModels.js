const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticle = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Article Not Found", status: 404 });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.editArticleVotesByID = (id, IncVote) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [IncVote, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
