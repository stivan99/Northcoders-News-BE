const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe.only("GET /api/topics", () => {
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
