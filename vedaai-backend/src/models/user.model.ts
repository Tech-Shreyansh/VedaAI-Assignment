// src/models/user.model.ts
// @ts-nocheck
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  Otp: String,
});

// 🚨 NO TYPES ANYWHERE
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;