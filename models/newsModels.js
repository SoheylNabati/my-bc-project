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
      if (rows.length === 0) {
        return Promise.reject({ msg: "Article Not Found", status: 404 });
      } else if (typeof IncVote !== "number") {
        return Promise.reject({
          msg: "Invalid Input, Type Of Votes Should Be A Number",
          status: 400,
        });
      }
      return rows[0];
    });
};

exports.fetchCommentsByArticleID = (id) => {
  const promise1 = db
    .query(`SELECT articles.* FROM articles WHERE articles.article_id=$1`, [id])
    .then(({ rows }) => {
      return rows;
    });
  const promise2 = db
    .query(
      `SELECT comments.* FROM comments WHERE comments.article_id=$1 ORDER BY comments.created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
  return Promise.all([promise1, promise2]).then((results) => {
    if (results[0].length === 0 && reesults[1].length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No Articles Found For article id ${id}`,
      });
    }
    return results[1];
  });
};
