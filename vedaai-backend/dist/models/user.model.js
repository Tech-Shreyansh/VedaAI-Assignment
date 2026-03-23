"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/user.model.ts
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    Otp: String,
});
// 🚨 NO TYPES ANYWHERE
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
