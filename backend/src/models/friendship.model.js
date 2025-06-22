import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enums: ["pending", "accepted", "declined", "blocked"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);

export default Friendship;
