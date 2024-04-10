import request from "supertest";

import app from "../app";
import sequelize from "../db";
import { User } from "../models/User";
import { Task } from "../models/Task";

describe("Tasks E2E", () => {
  let user: User;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    user = await User.create({ username: "user" });
  });

  describe("Create task", () => {
    test("should create a task", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ title: "title", description: "description" })
        .set("x-user-id", user.id);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: "title",
        description: "description",
        userId: user.id,
      });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ title: "", description: "description" })
        .set("x-user-id", user.id);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if user is not authenticated", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ title: "title", description: "description" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });
  });

  describe("Update task", () => {
    let task: Task;

    beforeEach(async () => {
      task = await Task.create({
        title: "title",
        description: "description",
        userId: user.id,
      });
    });

    test("should update a task", async () => {
      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: "newTitle",
          description: "newDescription",
          state: "inProgress",
        })
        .set("x-user-id", user.id);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: "newTitle",
        description: "newDescription",
        state: "inProgress",
        userId: user.id,
      });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: "newTitle",
          description: "newDescription",
          state: "invalid",
        })
        .set("x-user-id", user.id);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if task does not exists", async () => {
      const response = await request(app)
        .put(`/tasks/10`)
        .send({
          title: "newTitle",
          description: "newDescription",
          state: "inProgress",
        })
        .set("x-user-id", user.id);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });

    test("should fail if user is not authenticated", async () => {
      const response = await request(app).put(`/tasks/${task.id}`).send({
        title: "newTitle",
        description: "newDescription",
        state: "invalid",
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });

    test("should fail if user does not own task", async () => {
      const anotherUser = await User.create({ username: "anotherUser" });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: "newTitle",
          description: "newDescription",
          state: "inProgress",
        })
        .set("x-user-id", anotherUser.id);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });
  });

  describe("Archive task", () => {
    let task: Task;

    beforeEach(async () => {
      task = await Task.create({
        title: "title",
        description: "description",
        userId: user.id,
      });
    });

    test("should archive a task", async () => {
      const response = await request(app)
        .post(`/tasks/${task.id}/archive`)
        .set("x-user-id", user.id);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: "title",
        description: "description",
        state: "archived",
        userId: user.id,
      });
    });

    test("should fail if task is already archived", async () => {
      await task.update({ state: "archived" });

      const response = await request(app)
        .post(`/tasks/${task.id}/archive`)
        .set("x-user-id", user.id);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if task does not exists", async () => {
      const response = await request(app)
        .post(`/tasks/10/archive`)
        .set("x-user-id", user.id);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });

    test("should fail if user is not authenticated", async () => {
      const response = await request(app).post(`/tasks/${task.id}/archive`);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ error: "Unauthorized" });
    });

    test("should fail if user does not own task", async () => {
      const anotherUser = await User.create({ username: "anotherUser" });

      const response = await request(app)
        .post(`/tasks/${task.id}/archive`)
        .set("x-user-id", anotherUser.id);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });
  });

  describe("Get tasks", () => {
    let task1: Task, task2: Task;

    beforeEach(async () => {
      task1 = await Task.create({
        title: "title1",
        description: "description1",
        userId: user.id,
      });
      task2 = await Task.create({
        title: "title2",
        description: "description2",
        userId: user.id,
      });
    });

    test("should get tasks for an user", async () => {
      const response = await request(app)
        .get("/tasks")
        .set("x-user-id", user.id);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({ id: task1.id }),
          expect.objectContaining({ id: task2.id }),
        ])
      );
      expect(response.body).toHaveLength(2);
    });

    test("should omit archived tasks unless requested", async () => {
      await task1.update({ state: "archived" });

      const response = await request(app)
        .get("/tasks")
        .set("x-user-id", user.id);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        expect.arrayContaining([expect.objectContaining({ id: task2.id })])
      );
      expect(response.body).toHaveLength(1);

      const responseArchived = await request(app)
        .get("/tasks")
        .query({ includeArchived: true })
        .set("x-user-id", user.id);

      expect(responseArchived.status).toBe(200);
      expect(responseArchived.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({ id: task1.id }),
          expect.objectContaining({ id: task2.id }),
        ])
      );
      expect(responseArchived.body).toHaveLength(2);
    });

    test("should return only tasks owned by the user", async () => {
      const anotherUser = await User.create({ username: "anotherUser" });
      const task3 = await Task.create({
        title: "title3",
        description: "description3",
        userId: anotherUser.id,
      });

      const response = await request(app)
        .get("/tasks")
        .set("x-user-id", user.id);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({ id: task1.id }),
          expect.objectContaining({ id: task2.id }),
        ])
      );
      expect(response.body).toHaveLength(2);
    });
  });
});
