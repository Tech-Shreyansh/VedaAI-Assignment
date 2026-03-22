import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";

connectDB();
const app = express();
const server = http.createServer(app);

// 🔌 Socket setup
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});