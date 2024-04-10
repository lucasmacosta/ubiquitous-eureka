import { Op } from "sequelize";
import {
  GetTasksDto,
  CreateTaskDto,
  UpdateTaskDto,
} from "../controllers/dto/tasks";
import ApiError from "../lib/api-error";
import { Task } from "../models/Task";
import { User } from "../models/User";

export class TasksService {
  async getTasks(query: GetTasksDto, user: User) {
    return Task.findAll({
      where: {
        userId: user.id,
        ...(!query.includeArchived ? { state: { [Op.not]: "archived" } } : {}),
      },
      order: [["createdAt", "desc"]],
    });
  }

  async createTask(body: CreateTaskDto, user: User) {
    return Task.create({ ...body, userId: user.id });
  }

  async updateTask(id: number, body: UpdateTaskDto, user: User) {
    const task = await this.getTaskForUser(id, user);

    task.setAttributes(body);

    await task.save();

    return task;
  }

  async archiveTask(id: number, user: User) {
    const task = await this.getTaskForUser(id, user);

    if (task.state === "archived") {
      throw new ApiError("Task is already archived", "badRequest");
    }

    task.state = "archived";

    await task.save();

    return task;
  }

  private async getTaskForUser(id: number, user: User) {
    const task = await Task.findOne({
      where: { id, userId: user.id },
    });

    if (task === null) {
      // Do not disclose if the user owns the taks or not
      throw new ApiError("Not found", "notFound");
    }

    return task;
  }
}

export default new TasksService();
