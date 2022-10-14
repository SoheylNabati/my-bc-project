const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticle = (id) => {
  return db
    .query(
      `SELECT articles.*, Count(comments.comment_id) ::INT AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id=articles.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id;`,
      [id]
    )
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

exports.fetchArticles = (topic) => {
  if (topic === "") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request, Please enter name of topic`,
    });
  }
  let queryStr = "";
  if (topic === undefined) {
    queryStr = `SELECT articles.*, COUNT(comments.comment_id) ::INT AS comment_count FROM articles
LEFT JOIN comments ON comments.article_id=articles.article_id 
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`;
  } else
    queryStr = `SELECT articles.*, COUNT(comments.comment_id) ::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id 
  WHERE articles.topic='${topic}'
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  const promise1 = db
    .query(`SELECT topics.* FROM topics WHERE topics.slug='${topic}';`)
    .then(({ rows }) => {
      const myArr = [];
      if (rows[0] !== undefined) myArr.push(rows[0].slug);
      return myArr;
    });
  const promise2 = db.query(queryStr).then(({ rows }) => {
    return rows;
  });
  return Promise.all([promise1, promise2]).then((result) => {
    if (result[1].length === 0 && result[0].length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No Topic Found For Topic ${topic}`,
      });
    }
    return result[1];
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
    if (results[0].length === 0 && results[1].length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No Articles Found For article id ${id}`,
      });
    }
    return results[1];
  });
};
