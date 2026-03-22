// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

// 🔢 Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ SEND OTP
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({ message: "Email required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const otp = generateOtp();

    user.Otp = otp;
    await user.save();

    console.log("OTP:", otp); // 👈 for testing (IMPORTANT)

    return res.json({ message: "OTP sent" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.Otp !== otp) {
      return res.status(422).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.Otp = null;

    await user.save();

    return res.json({ message: "OTP verified" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ SIGNUP (SET PASSWORD)
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(403).json({ message: "Verify OTP first" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    await user.save();

    return res.json({ message: "Signup successful" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ message: "Login successful" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};