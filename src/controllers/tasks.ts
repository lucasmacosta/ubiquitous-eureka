import { Request, Response } from "express";

import {
  GetTasksDto,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskParamsDto,
} from "./dto/tasks";
import { User } from "../models/User";
import tasksService, { TasksService } from "../services/tasks";

export class TasksController {
  constructor(private tasksService: TasksService) {}

  async getTasks(req: Request, res: Response) {
    const query = res.locals.validated.query as GetTasksDto;
    const user = res.locals.user as User;

    const tasks = await this.tasksService.getTasks(query, user);

    res.status(201).json(tasks);
  }

  async createTask(req: Request, res: Response) {
    const body = res.locals.validated.body as CreateTaskDto;
    const user = res.locals.user as User;

    const task = await this.tasksService.createTask(body, user);

    res.status(201).json(task);
  }

  async updateTask(req: Request, res: Response) {
    const params = res.locals.validated.params as UpdateTaskParamsDto;
    const body = res.locals.validated.body as UpdateTaskDto;
    const user = res.locals.user as User;

    const task = await this.tasksService.updateTask(params.id, body, user);

    res.status(200).json(task);
  }

  async archiveTask(req: Request, res: Response) {
    const params = res.locals.validated.params as UpdateTaskParamsDto;
    const user = res.locals.user as User;

    const task = await this.tasksService.archiveTask(params.id, user);

    res.status(200).json(task);
  }
}

export default new TasksController(tasksService);
