import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
} from "sequelize-typescript";

import { User } from "./User";

interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  state: "todo" | "inProgress" | "done" | "archived";
  userId: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonCreationAttributes
  extends Optional<
    TaskAttributes,
    "id" | "state" | "createdAt" | "updatedAt" | "user"
  > {}

@Table
export class Task extends Model<TaskAttributes, PersonCreationAttributes> {
  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  description!: string;

  @AllowNull(false)
  @Default("todo")
  @Column(DataType.ENUM("todo", "inProgress", "done", "archived"))
  state!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
