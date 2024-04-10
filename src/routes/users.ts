import { Router } from "express";

import buildValidator from "../middlewares/build-validator";
import usersController from "../controllers/users";
import { createUserSchema } from "../controllers/dto/users";

const users = Router();

users.post(
  "/",
  buildValidator("body", createUserSchema),
  usersController.createUser.bind(usersController)
);

export default users;
