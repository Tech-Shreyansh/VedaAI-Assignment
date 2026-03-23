"use strict";
// src/controllers/auth.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.verifyOtp = exports.sendOtp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const email_service_1 = require("../services/email.service");
// 🔢 Generate OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// ✅ SEND OTP
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, type } = req.body;
        const emailNormalized = email.toLowerCase().trim();
        let user = yield user_model_1.default.findOne({ email: emailNormalized });
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
        if (!user)
            user = yield user_model_1.default.create({ email: emailNormalized });
        // 🔥 COMMON OTP LOGIC
        const otp = generateOtp();
        user.Otp = otp;
        yield user.save();
        yield (0, email_service_1.sendOtpEmail)(emailNormalized, otp);
        return res.json({ message: "OTP sent" });
    }
    catch (err) {
        console.error("===== ERROR START =====");
        console.error("Message:", err === null || err === void 0 ? void 0 : err.message);
        console.error("Stack:", err === null || err === void 0 ? void 0 : err.stack);
        console.error("Full Error:", err);
        console.error("===== ERROR END =====");
        return res.status(500).json({
            message: "Server error",
            error: err === null || err === void 0 ? void 0 : err.message,
        });
    }
});
exports.sendOtp = sendOtp;
// ✅ VERIFY OTP
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user || user.Otp != otp) {
            if (!user)
                return res.status(422).json({ message: "No Such User Exists" });
            console.log(user.Otp, otp);
            return res.status(422).json({ message: "Invalid OTP" });
        }
        user.isVerified = true;
        user.Otp = null;
        yield user.save();
        return res.json({ message: "OTP verified" });
    }
    catch (_a) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.verifyOtp = verifyOtp;
// ✅ SIGNUP (SET PASSWORD)
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(403).json({ message: "Verify OTP first" });
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        user.password = hashed;
        yield user.save();
        return res.json({ userId: user.id, message: "Signup successful" });
    }
    catch (_a) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.signup = signup;
// ✅ LOGIN
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !user.password) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        return res.json({ userId: user.id, message: "Login successful" });
    }
    catch (_a) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
