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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly created object in the database", () => {
    const commentToAdd = {
      body: "This is just testing text",
      votes: 1,
      author: "icellusedkars",
      article_id: 2,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToAdd)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          body: "This is just testing text",
          votes: 1,
          author: "icellusedkars",
          article_id: 2,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("400: Responds with an error when comment data is incomplete", () => {
    const commentToAdd = {
      body: "This is just testing text",
      votes: 1,
      author: "icellusedkars",
      // article_id: 2,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToAdd)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with the correct error when the given article_id is invalid", () => {
    const commentToAdd = {
      body: "This is just testing text",
      votes: 1,
      author: "icellusedkars",
      article_id: 999,
      created_at: expect.any(String),
      comment_id: expect.any(Number),
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(commentToAdd)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article doesn not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates the vote count of an existing article with the given value", () => {
    const body = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("votes");
      });
  });
  test("400: responds with bad request if invalid data type is given for inc_votes", () => {
    const body = {
      inc_votes: "ten",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: Article does not exist if article_id is out of range", () => {
    const body = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/999")
      .send(body)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("DELETE /api/comments/comment_id", () => {
  test("204: should delete the comment with the associated comment_id and return an empty body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({});
        return request(app).get("/api/comments/1").expect(404);
      });
  });

  test("404: returns error stating that the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Comment_id does not exist");
      });
  });
  test("400: should return a bad request message if comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of objects with the properties of username, name and avatar_url.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { body } = response; // body is the same as results from controller
        expect(body).toHaveProperty("users");
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("404: responds with an error message saying that the requested resource does not exist", () => {
    return request(app).get("/api/usersss").expect(404);
  });
});
