import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: "posts",
  dialect: "sqlite",
  storage: ":memory:",
  models: [__dirname + "/models"],
});

export default sequelize;
