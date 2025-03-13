import express from "express";
import {
  getAllTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getAllDoneTasks,
} from "../controller/task.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/done", getAllDoneTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/", updateTask);
router.delete("/:id", deleteTask);
router.put("/updateStatus", updateTaskStatus);

export default router;
