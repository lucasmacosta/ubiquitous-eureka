import { Request, Response } from "express";

import { CreateUserDto } from "./dto/users";
import usersService, { UsersService } from "../services/users";

class UsersController {
  constructor(private usersService: UsersService) {}

  async createUser(req: Request, res: Response) {
    const body = res.locals.validated.body as CreateUserDto;

    const user = await this.usersService.create(body);

    res.status(201).json(user);
  }
}

export default new UsersController(usersService);
