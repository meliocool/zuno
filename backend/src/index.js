import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendshipRoutes from "./routes/friendship.route.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friends", friendshipRoutes);

server.listen(5001, () => {
  console.log(`Server is up and running on Port: ${PORT}`);
  connectDB();
});
