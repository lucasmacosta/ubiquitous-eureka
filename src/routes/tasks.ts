import { Router } from "express";

import checkUser from "../middlewares/check-user";
import buildValidator from "../middlewares/build-validator";
import tasksController from "../controllers/tasks";
import {
  getTasksSchema,
  createTaskSchema,
  updateTaskParamsSchema,
  updateTaskSchema,
} from "../controllers/dto/tasks";

const tasks = Router();

tasks.use(checkUser);

tasks.get(
  "/",
  buildValidator("query", getTasksSchema),
  tasksController.getTasks.bind(tasksController)
);
tasks.post(
  "/",
  buildValidator("body", createTaskSchema),
  tasksController.createTask.bind(tasksController)
);
tasks.put(
  "/:id",
  buildValidator("params", updateTaskParamsSchema),
  buildValidator("body", updateTaskSchema),
  tasksController.updateTask.bind(tasksController)
);
tasks.post(
  "/:id/archive",
  buildValidator("params", updateTaskParamsSchema),
  tasksController.archiveTask.bind(tasksController)
);

export default tasks;
