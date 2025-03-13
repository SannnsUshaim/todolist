import { z } from "zod";

export const TaskSchema = z.object({
  _id: z.number(),
  title: z.string().min(1, { message: "Task Title is required" }),
  description: z.string().min(1, { message: "Task Description is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  deadlineDate: z.string().min(1, { message: "Deadline date is required" }),
  status: z.number(),
});

export const TaskStatusSchema = z.object({
  _id: z.number(),
  status: z.number(),
});
