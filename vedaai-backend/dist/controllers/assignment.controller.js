"use strict";
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
exports.deleteAssignmentById = exports.regenerateAssignment = exports.getAssignmentById = exports.getAssignments = exports.createAssignment = void 0;
// @ts-nocheck
const assignment_model_1 = __importDefault(require("../models/assignment.model"));
const ai_service_1 = require("../services/ai.service");
const createAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { topic, standard, dueDate, additional_info, question_config, userId, duration } = req.body;
        console.log(typeof question_config);
        // ✅ Basic validation
        if (!topic || !standard || !(question_config === null || question_config === void 0 ? void 0 : question_config.length) || !duration) {
            return res.status(422).json({
                message: "Topic, standard, duration and question config are required",
            });
        }
        // ✅ Calculate totals (good practice)
        let totalQuestions = 0;
        let totalMarks = 0;
        question_config.forEach((q) => {
            totalQuestions += q.count;
            totalMarks += q.count * q.marks;
        });
        // 🧠 Build prompt (VERY IMPORTANT for AI)
        const prompt = `You are an exam paper generator. Create a structured question paper based on Topic: ${topic} for Standard: ${standard}. Total Questions: ${totalQuestions}. Total Marks: ${totalMarks} Question Configuration: ${question_config
            .map((q) => `${q.type}: ${q.count} questions, ${q.marks} marks each`)
            .join("\n")}. Additional Instructions are ${additional_info || "None"}. Output guidelines are : 
      - Divide into sections (Section A, B, etc.)
      - Include question text
      - Include difficulty (easy/medium/hard)
      - Include marks
      Return structured JSON only where it has key as sections which contain array as of objects as value. Each array element should have keys - section_name, is_mcq, questions. Now questions is also an array of elements where each element has keys - question, answer, difficulty-[easy/medium/hard], marks, options(in case of mcq and there should be exactly 4 options). Return this exact JSON format only as plain text. DO NOT wrap inside code block or markdown.
      `;
        if (typeof question_config === "string") {
            question_config = JSON.parse(question_config);
        }
        // 💾 Save assignment (pending state)
        const assignment = yield assignment_model_1.default.create({
            topic,
            standard,
            dueDate,
            duration,
            totalMarks,
            question_config,
            additional_info,
            user: userId,
            prompt_sent: prompt,
            status: "pending",
        });
        // 🤖 CALL AI
        const aiResponse = yield (0, ai_service_1.generateQuestions)(prompt);
        let parsed;
        try {
            parsed = JSON.parse(aiResponse);
        }
        catch (_a) {
            parsed = { raw: aiResponse }; // fallback
        }
        // 💾 update assignment
        assignment.response_from_llm = parsed;
        assignment.status = "completed";
        yield assignment.save();
        return res.status(201).json({
            message: "Assignment generated",
            assignmentId: assignment._id,
            response_from_llm: parsed
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.createAssignment = createAssignment;
const getAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        let filter = {};
        if (userId) {
            filter.user = userId;
        }
        const assignments = yield assignment_model_1.default.find(filter)
            .select("topic dueDate createdAt _id")
            .sort({ createdAt: -1 });
        return res.json({
            count: assignments.length,
            assignments,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getAssignments = getAssignments;
const getAssignmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assignment = yield assignment_model_1.default.findById(id)
            .select("_id topic standard dueDate duration question_config response_from_llm");
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        return res.json({ assignment });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getAssignmentById = getAssignmentById;
const regenerateAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assignment = yield assignment_model_1.default.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        const { topic, standard, question_config, additional_info, } = assignment;
        // 🔥 calculate totals
        const totalQuestions = question_config.reduce((sum, q) => sum + q.count, 0);
        const totalMarks = question_config.reduce((sum, q) => sum + q.count * q.marks, 0);
        // 🧠 prompt
        const prompt = `You are an exam paper generator. Create a structured question paper based on Topic: ${topic} for Standard: ${standard}. Total Questions: ${totalQuestions}. Total Marks: ${totalMarks} Question Configuration: ${question_config
            .map((q) => `${q.type}: ${q.count} questions, ${q.marks} marks each`)
            .join("\n")}. Additional Instructions are ${additional_info || "None"}. Output guidelines are : 
      - Divide into sections (Section A, B, etc.)
      - Include question text
      - Include difficulty (easy/medium/hard)
      - Include marks
      Return structured JSON only where it has key as sections which contain array as of objects as value. Each array element should have keys - section_name, is_mcq, questions. Now questions is also an array of elements where each element has keys - question, answer, difficulty-[easy/medium/hard], marks, options(in case of mcq and there should be exactly 4 options). Return this exact JSON format only as plain text. DO NOT wrap inside code block or markdown.`;
        // 🤖 AI call
        const aiResponse = yield (0, ai_service_1.generateQuestions)(prompt);
        let parsed;
        try {
            parsed = JSON.parse(aiResponse);
        }
        catch (_a) {
            parsed = { raw: aiResponse };
        }
        // 💾 update
        assignment.response_from_llm = parsed;
        assignment.prompt_sent = prompt;
        yield assignment.save();
        const assignmentUpdated = yield assignment_model_1.default.findById(id)
            .select("_id topic standard dueDate duration question_config response_from_llm");
        return res.status(200).json({
            message: "Assignment regenerated",
            assignmentId: assignment._id,
            assignmentNew: assignmentUpdated,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.regenerateAssignment = regenerateAssignment;
const deleteAssignmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield assignment_model_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                message: "Assignment not found",
            });
        }
        return res.status(200).json({
            message: "Assignment deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
        });
    }
});
exports.deleteAssignmentById = deleteAssignmentById;
