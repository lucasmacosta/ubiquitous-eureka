import request from "supertest";

import app from "../app";
import sequelize from "../db";

describe("Users E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe("Create user", () => {
    test("should create a user", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "user" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ username: "user" });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app).post("/users").send({ username: "" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if user already exists", async () => {
      await request(app).post("/users").send({ username: "user" });

      const response = await request(app)
        .post("/users")
        .send({ username: "user" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });
  });
});
