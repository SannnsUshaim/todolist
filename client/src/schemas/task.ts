import { z } from "zod";

export const TaskSchema = z.object({
  // _id: z.number(),
  title: z.string().min(1, { message: "Task Title is required" }),
  description: z.string().min(1, { message: "Task Description is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  deadlineDate: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Deadline Date must be today or in the future",
  }),
  // status: z.string(),
});

export const TaskDeleteSchema = z.object({
  _id: z.number(),
});

export const TaskStatusSchema = z.object({
  _id: z.number(),
  status: z.number(),
});
