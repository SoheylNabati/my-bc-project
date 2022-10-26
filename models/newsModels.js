const { query } = require("../db/connection");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/users");

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

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSortby = [
    "created_at",
    "votes",
    "article_id",
    "title",
    "topic",
    "author",
    "body",
  ];
  validOrder = ["ASC", "DESC"];
  if (!validSortby.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `can not sort articles, please sort by a valid column`,
    });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `can not order articles, the order can be ascending or descending`,
    });
  }
  if (topic === "") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request, Please enter name of topic`,
    });
  }
  let queryStr = `SELECT articles.*, COUNT(comments.comment_id) ::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id=articles.article_id `;
  if (topic === undefined) {
    queryStr += `GROUP BY articles.article_id
ORDER BY articles.${sort_by} ${order};`;
  } else
    queryStr += `WHERE articles.topic='${topic}'
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;
  const promise1 = db
    .query(`SELECT topics.* FROM topics WHERE topics.slug='${topic}';`)
    .then(({ rows }) => {
      return rows;
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

exports.addCommentByArticleId = (id, comment) => {
  if (comment.username === undefined || comment.body === undefined) {
    return Promise.reject({
      status: 400,
      msg: `you must enter data for username and comment fields`,
    });
  }
  const users = db
    .query(`SELECT users.* FROM users WHERE users.username=$1;`, [
      comment.username,
    ])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          msg: `username with username id ${comment.username} doesn't exist`,
          status: 404,
        });
      return rows;
    });
  const articles = db
    .query(`SELECT articles.* FROM articles WHERE articles.article_id=$1;`, [
      id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          msg: `article with article id ${id} doesn't exist`,
          status: 404,
        });
      return rows;
    });
  const comments = db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [comment.body, comment.username, id]
    )
    .then(({ rows }) => {
      return rows;
    });
  return Promise.all([users, comments, articles]).then((results) => {
    return results[1][0];
  });
};
