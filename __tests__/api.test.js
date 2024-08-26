const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array with topics data with the correct properties of description and slug.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { body } = response;
        //console.log(body);
        expect(body).toHaveProperty("topics");
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: responds with an error message saying that the requested resource does not exist", () => {
    return request(app).get("/api/topicss").expect(404);
  });
});
describe("GET /api", () => {
  test("200: responds with an an object of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        // console.log(response.body);
        const { body } = response;
        expect(body).toEqual(endpointData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object that contains nessesary properties.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { body } = response;
        // console.log(body);
        expect(body).toHaveProperty("article_id", expect.any(Number));
        expect(body).toHaveProperty("title", expect.any(String));
        expect(body).toHaveProperty("topic", expect.any(String));
        expect(body).toHaveProperty("author", expect.any(String));
        expect(body).toHaveProperty("body", expect.any(String));
        expect(body).toHaveProperty("created_at", expect.any(String));
        expect(body).toHaveProperty("votes", expect.any(Number));
        expect(body).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: responds with an error message when the requested article does not exist", () => {
    return request(app)
      .get("/api/articles/1111")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with an error message when the requested article is wrong format", () => {
    return request(app)
      .get("/api/articles/aaaaa")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of articles with the correct properties.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        //const { body } = response;
        // console.log(response.body);
        expect(response.body).toHaveLength(13);
        response.body.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("404: responds with an error message saying that the requested resource does not exist", () => {
    return request(app).get("/api/articless").expect(404);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments containing the specified article_id value.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        // console.log(body);
        expect(body).toHaveLength(11);
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("400: responds with an error message when the requested article does not exist", () => {
    return request(app)
      .get("/api/articles/1111/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with an error message when the requested article is wrong format", () => {
    return request(app)
      .get("/api/articles/aaaaa/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
