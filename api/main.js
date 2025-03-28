import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tasksRoutes from "./routes/task.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL_CORS,
    credentials: true,
  })
);

app.use(express.json());
app.listen(3300, () => {
  console.log("Server is running on http://localhost:3300/api");
});

app.use("/api/tasks", tasksRoutes);
