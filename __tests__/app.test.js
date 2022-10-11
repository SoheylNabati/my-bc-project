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
