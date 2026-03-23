// @ts-nocheck
import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },

    standard: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Assignment =
  mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);

export default Assignment;