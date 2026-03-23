// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
// import { sendOtpEmail } from "../services/email.service";

// 🔢 Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ SEND OTP
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
  
    const emailNormalized = email.toLowerCase().trim();
  
    let user = await User.findOne({ email: emailNormalized });
  
    // 🟢 SIGNUP FLOW
    if (type === "signup") {
      if (user && user.isVerified && user.password) {
        return res.status(400).json({ message: "User already exists" });
      }
    }
  
    // 🔵 RESET FLOW
    if (type === "reset") {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }
  
    if(!user) 
      user = await User.create({ email: emailNormalized });

    // 🔥 COMMON OTP LOGIC
    const otp = generateOtp();
  
    user.Otp = otp;
    await user.save();
  
    // await sendOtpEmail(emailNormalized, otp);

    return res.json({ otp: otp, message: "OTP sent" });
  
  } catch (err: any) {
    console.error("===== ERROR START =====");
    console.error("Message:", err?.message);
    console.error("Stack:", err?.stack);
    console.error("Full Error:", err);
    console.error("===== ERROR END =====");
  
    return res.status(500).json({
      message: "Server error",
      error: err?.message,
    });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email : emailNormalized });
    
    if (!user || user.Otp != otp) {
      console.log(emailNormalized)
      if(!user) return res.status(422).json({ message: "No Such User Exists" });
      console.log(user.Otp, otp)
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
    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email : emailNormalized });

    if (!user || !user.isVerified) {
      return res.status(403).json({ message: "Verify OTP first" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    await user.save();

    return res.json({ userId: user.id, message: "Signup successful" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const emailNormalized = email.toLowerCase().trim();
    const user = await User.findOne({ email : emailNormalized });

    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ userId: user.id ,message: "Login successful" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};