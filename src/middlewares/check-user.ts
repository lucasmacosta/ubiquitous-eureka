import { Request, Response, NextFunction } from "express";
import { Schema } from "zod";

import ApiError from "../lib/api-error";
import { User } from "../models/User";

export default async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.headers["x-user-id"] || 0);

  const user = await User.findOne({ where: { id: userId } });

  if (user === null) {
    throw new ApiError("Not authorized", "unauthorized");
  }

  res.locals.user = user;

  next();
}
