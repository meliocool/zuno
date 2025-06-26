import { getReceiverSocketId, io } from "../lib/socket.js";
import Friendship from "../models/friendship.model.js";
import User from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const { id: recipientId } = req.params;

    if (requesterId.toString() === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send friend request to yourself!" });
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingFriendship) {
      return res.status(400).json({
        message:
          "A friend request has already been sent or you are already homies!",
      });
    }

    const newFriendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    await newFriendship.save();

    const recipientSocketId = getReceiverSocketId(recipientId);
    if (recipientSocketId) {
      const requestWithUserData = await Friendship.findById(
        newFriendship._id
      ).populate("requester", "fullName profilePic username");

      io.to(recipientSocketId).emit("newFriendRequest", requestWithUserData);
    }

    res.status(201).json({
      message: "Friend request sent successfully!",
      friendship: newFriendship,
    });
  } catch (error) {
    console.log("Error in sendFriendRequest Controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const respondFriendRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: friendshipId } = req.params;
    const { response } = req.body;

    if (!["accepted", "declined"].includes(response)) {
      return res.status(400).json({ message: "Error, invalid response!" });
    }

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({ message: "Friendship Not Found!" });
    }

    if (friendship.recipient.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ error: "You are not Authorized!" });
    }

    if (friendship.status !== "pending") {
      return res
        .status(400)
        .json({ error: "You already responded to this friend request!" });
    }

    friendship.status = response;
    await friendship.save();

    if (response === "accepted") {
      const requesterId = friendship.requester;

      const requesterData = await User.findById(requesterId).select(
        "-password"
      );
      const recipientData = await User.findById(loggedInUserId).select(
        "-password"
      );

      const requesterSocketId = getReceiverSocketId(requesterId.toString());
      if (requesterSocketId) {
        io.to(requesterSocketId).emit("friendRequestAccepted", recipientData);
      }
      const recipientSocketId = getReceiverSocketId(loggedInUserId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("friendRequestAccepted", requesterData);
      }
    }
    res
      .status(200)
      .json({ message: `Friend request: ${response}`, friendship });
  } catch (error) {
    console.log("Error in respondToFriendRequest controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;
    const pendingRequests = await Friendship.find({
      recipient: loggedInUserId,
      status: "pending",
    }).populate("requester", "fullName profilePic username");
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.log("Error in getPendingRequests controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
