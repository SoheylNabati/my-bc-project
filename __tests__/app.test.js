const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  it("should return an Array of all topics with a status code of 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topic = body.topics;
        expect(topic).toHaveLength(3);
        expect(topic).toBeInstanceOf(Array);
        topic.forEach((each) => {
          expect(each).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("app", () => {
  it("should respond with a 404 error and a msg telling user that the page does not exist when user requested an endpoint that does not exist", () => {
    return request(app)
      .get("/api/getalltopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Page Not Found!");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with a single article object, which should have author property which is the username from the users table, title, article_id, body, topic created_at and votes property with a status code of 200", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: article_id,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
        });
      });
  });
  it("400: respond with an error message when pased an article id that is invalid type", () => {
    return request(app)
      .get(`/api/articles/cheese`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  it("404: responds with an error message when passed a article id that is valid but does not exist in the database", () => {
    return request(app)
      .get(`/api/articles/21858583`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

describe("GET /api/users", () => {
  it("should return an Array of objects containing all users with a status code of 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("should update vote count property in the requsted article object and responds with newly updated updated article with a status code of 200", () => {
    const updateVote = { votes: 1 };
    const updatedArticle2 = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      votes: 1,
    };
    return request(app)
      .patch(`/api/articles/2`)
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(updatedArticle2);
      });
  });
  it("200: update votes count, respond with newly updated article", () => {
    const updateVotes = {
      votes: -98,
    };
    const article1 = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(article1);
        expect(body.article.votes).toBe(2);
      });
  });

  it("400: respond with an error message when pased an article id that is invalid type", () => {
    const updateVotes = {
      votes: 16,
    };

    return request(app)
      .patch(`/api/articles/pasta`)
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("404: responds with an error message when passed a article id that is valid but does not exist in the database", () => {
    const updateVotes = {
      votes: 7,
    };
    return request(app)
      .patch("/api/articles/25")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Article Not Found");
      });
  });
  it("400: responds with an error message when passed a invalid data type to increment votes", () => {
    const updateVotes = {
      votes: "cheese",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "Invalid Input, Type Of Votes Should Be A Number"
        );
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comments for the given article_id and each comment should have properties of comment_id, votes, created_at, author and body sorted by created_at in descending order", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  it("200: responds with an empty array when article exists but there are no comments", () => {
    const article_id = 4;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  it("400: responds with an error msg when passed an invalid data type for article id", () => {
    const article_id = "protein";

    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid ID");
      });
  });
  // it("404: responds with an error msg when requested for a query that doesnt exist ", () => {
  //   const article_id = 35;
  //   return request(app)
  //     .get(`/api/articles/${article_id}/comments`)
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe(`No Articles Found For article id ${article_id}`);
  //     });
  // });
});
