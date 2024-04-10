import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

export const updateTaskSchema = createTaskSchema.extend({
  title: createTaskSchema.shape.title.optional(),
  description: createTaskSchema.shape.description.optional(),
  state: z.enum(["todo", "inProgress", "done", "archived"]),
});

export const updateTaskParamsSchema = z.object({
  id: z.coerce.number(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type UpdateTaskParamsDto = z.infer<typeof updateTaskParamsSchema>;
