import { Router } from "express";

import buildValidator from "../middlewares/build-validator";
import { createUser } from "../controllers/users";
import { createUserSchema } from "../controllers/dto/users";

const users = Router();

users.post("/", buildValidator("body", createUserSchema), createUser);

export default users;
