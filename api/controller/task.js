import { db } from "../config/db.js";

export const getAllTasks = (_req, res) => {
  const q = "SELECT * FROM task WHERE status = 1";
  db.query(q, (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const getAllDoneTasks = (_req, res) => {
  const q = "SELECT * FROM task WHERE status = 0";
  db.query(q, (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const getTask = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM task WHERE id = ?`;
  db.query(q, [id], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data[0]);
  });
};

export const addTask = (req, res) => {
  const { title, description, priority, deadlineDate } = req.body;
  const q = `INSERT INTO task (title, description, priority, deadlineDate) VALUES (?)`;
  const values = [title, description, priority, deadlineDate];
  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);

    res.status(201).json({ message: "Task added successfully" });
  });
};

export const updateTask = (req, res) => {
  const { _id, title, description, priority, deadlineDate } = req.body;
  const q = `UPDATE task SET title = ?, description = ?, priority = ?, deadlineDate = ? WHERE _id = ?`;
  const values = [title, description, priority, deadlineDate, _id];
  db.query(q, values, (err, data) => {
    if (err) return res.send(err);

    res.status(200).json({ message: "Task updated successfully" });
  });
};

export const deleteTask = (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM task WHERE id = ?`;
  db.query(q, [id], (err, data) => {
    if (err) return res.send(err);

    res.status(200).json({ message: "Task deleted successfully" });
  });
};

export const updateTaskStatus = (req, res) => {
  const { id, status } = req.body;
  const q = `UPDATE task SET status = ? WHERE id = ?`;
  const values = [status, id];
  db.query(q, values, (err, data) => {
    if (err) return res.send(err);

    res.status(200).json({ message: "Task status updated successfully" });
  });
};
