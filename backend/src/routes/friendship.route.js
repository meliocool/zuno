import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPendingRequests,
  respondFriendRequest,
  sendFriendRequest,
} from "../controllers/friendship.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/send/:id", sendFriendRequest);

router.put("/respond/:id", respondFriendRequest);

router.get("/pending", getPendingRequests);

export default router;
