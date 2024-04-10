import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  HasMany,
  AllowNull,
  Unique,
} from "sequelize-typescript";

import { Task } from "./Task";

interface UserAttributes {
  id: number;
  username: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

interface PersonCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "createdAt" | "updatedAt" | "tasks"
  > {}

@Table
export class User extends Model<UserAttributes, PersonCreationAttributes> {
  @Unique
  @AllowNull(false)
  @Column
  username!: string;

  @HasMany(() => Task)
  tasks!: Task[];

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
