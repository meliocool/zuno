import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

// Kalo mau populate the db
const seedUsers = {};

const populate = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("Database Seeded Successfully!");
  } catch (error) {
    console.error("Error Seeding Database!", error);
  }
};

// populate();
