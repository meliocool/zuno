import cloudinary from "../lib/cloudinary.js";
import Friendship from "../models/friendship.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSidebarUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // const filteredUsers = await User.find({
    //   _id: { $ne: loggedInUserId },
    // }).select("-password");

    const friendships = await Friendship.find({
      $or: [{ requester: loggedInUserId }, { recipient: loggedInUserId }],
      status: "accepted",
    }).populate("requester recipient", "-password");

    const friends = friendships.map((friendship) => {
      if (friendship.requester._id.toString() === loggedInUserId.toString()) {
        return friendship.recipient;
      } else {
        return friendship.requester;
      }
    });

    res.status(200).json(friends);
  } catch (error) {
    console.log("Error in getSidebarUsers: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userChatId },
        { senderId: userChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { query } = req.params;

    if (!query) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } },
          ],
        },
      ],
    }).select("fullName username profilePic");

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Todo: Realtime Functionality => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
