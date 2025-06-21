import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getSidebarUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", authMiddleware, getSidebarUsers);
router.get("/:id", authMiddleware, getMessages);
router.post("/send/:id", authMiddleware, sendMessage);

export default router;
