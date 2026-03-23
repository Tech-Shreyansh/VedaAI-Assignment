"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const AssignmentSchema = new mongoose_1.default.Schema({
    topic: {
        type: String,
        required: true,
    },
    standard: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    dueDate: {
        type: String,
    },
    duration: {
        type: Number,
    },
    total_marks: {
        type: Number,
    },
    question_config: [
        {
            type: {
                type: String,
            },
            count: {
                type: Number,
            },
            marks: {
                type: Number,
            },
        },
    ],
    additional_info: String,
    prompt_sent: String,
    response_from_llm: Object,
    status: {
        type: String,
        default: "pending", // pending | completed
    },
}, { timestamps: true });
const Assignment = mongoose_1.default.models.Assignment ||
    mongoose_1.default.model("Assignment", AssignmentSchema);
exports.default = Assignment;
