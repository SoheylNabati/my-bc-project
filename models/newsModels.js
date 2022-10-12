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

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id) ::INT AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id=articles.article_id
      GROUP BY articles.article_id;`
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};
