import { CreateUserDto } from "../controllers/dto/users";
import { User } from "../models/User";
import ApiError from "../lib/api-error";

export class UsersService {
  async create(body: CreateUserDto) {
    try {
      const user = await User.create(body);
      return user;
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
}

export default new UsersService();
