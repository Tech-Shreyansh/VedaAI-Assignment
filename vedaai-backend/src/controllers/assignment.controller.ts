// @ts-nocheck
import Assignment from "../models/assignment.model";
import { generateQuestions } from "../services/ai.service";

export const createAssignment = async (req, res) => {
  try {
    console.log(req.body)
    const {
      topic,
      standard,
      dueDate,
      additional_info,
      question_config,
      userId,
      duration
    } = req.body;

    console.log(typeof question_config)
    // ✅ Basic validation
    if (!topic || !standard || !question_config?.length || duration) {
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
      .map(
        (q) =>
          `${q.type}: ${q.count} questions, ${q.marks} marks each`
      )
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
    const assignment = await Assignment.create({
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
    const aiResponse = await generateQuestions(prompt);

    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = { raw: aiResponse }; // fallback
    }

    // 💾 update assignment
    assignment.response_from_llm = parsed;
    assignment.status = "completed";

    await assignment.save();

    return res.status(201).json({
      message: "Assignment generated",
      assignmentId: assignment._id,
      response_from_llm: parsed
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = {};

    if (userId) {
      filter.user = userId;
    }

    const assignments = await Assignment.find(filter)
      .select("topic dueDate createdAt _id")
      .sort({ createdAt: -1 });

    return res.json({
      count: assignments.length,
      assignments,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.json({ assignment });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};