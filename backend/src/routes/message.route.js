import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getSidebarUsers,
  searchUsers,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", authMiddleware, getSidebarUsers);
router.get("/:id", authMiddleware, getMessages);
router.get("/search/:query", authMiddleware, searchUsers);
router.post("/send/:id", authMiddleware, sendMessage);

export default router;
