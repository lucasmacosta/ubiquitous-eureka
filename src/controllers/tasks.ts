import { Request, Response } from "express";

import { Task } from "../models/Task";
import { CreateTaskDto, UpdateTaskDto, UpdateTaskParamsDto } from "./dto/tasks";
import { User } from "../models/User";
import ApiError from "../lib/api-error";

export async function getTasks(req: Request, res: Response) {
  const user = res.locals.user as User;

  const tasks = await Task.findAll({ order: [["createdAt", "desc"]] });

  res.status(201).json(tasks);
}

export async function createTask(req: Request, res: Response) {
  const body = res.locals.validated.body as CreateTaskDto;
  const user = res.locals.user as User;

  const task = await Task.create({ ...body, userId: user.id });

  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const params = res.locals.validated.params as UpdateTaskParamsDto;
  const body = res.locals.validated.body as UpdateTaskDto;
  const user = res.locals.user as User;

  const task = await Task.findOne({
    where: { id: params.id, userId: user.id },
  });

  if (task === null) {
    // Do not disclose if the user owns the taks or not
    throw new ApiError("Not found", "notFound");
  }

  task.setAttributes(body);

  await task.save();

  res.status(200).json(task);
}
