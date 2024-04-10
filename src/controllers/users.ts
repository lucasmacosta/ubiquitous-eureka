import { Request, Response } from "express";

import { CreateUserDto } from "./dto/users";
import { User } from "../models/User";
import ApiError from "../lib/api-error";

export async function createUser(req: Request, res: Response) {
  const body = res.locals.validated.body as CreateUserDto;

  try {
    const user = await User.create(body);

    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "SequelizeUniqueConstraintError"
    ) {
      throw new ApiError("User already exists", "badRequest");
    }

    throw error;
  }
}
