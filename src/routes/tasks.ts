import { Router } from "express";

import checkUser from "../middlewares/check-user";
import buildValidator from "../middlewares/build-validator";
import { createTask, getTasks, updateTask } from "../controllers/tasks";
import {
  createTaskSchema,
  updateTaskParamsSchema,
  updateTaskSchema,
} from "../controllers/dto/tasks";

const tasks = Router();

tasks.use(checkUser);

tasks.get("/", getTasks);
tasks.post("/", buildValidator("body", createTaskSchema), createTask);
tasks.put(
  "/:id",
  buildValidator("params", updateTaskParamsSchema),
  buildValidator("body", updateTaskSchema),
  updateTask
);

export default tasks;
