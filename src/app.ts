import express from "express";
import bodyParser from "body-parser";
import "express-async-errors";

import users from "./routes/users";
import tasks from "./routes/tasks";
import errorHandler from "./middlewares/error-handler";

export const app = express();

// middleware for json body parsing
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/users", users);
app.use("/tasks", tasks);

app.use(errorHandler);

export default app;
