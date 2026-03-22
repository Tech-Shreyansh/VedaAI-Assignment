// @ts-nocheck
import Assignment from "../models/assignment.model";

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
    } = req.body;

    console.log(typeof question_config)
    // ✅ Basic validation
    if (!topic || !standard || !question_config?.length) {
      return res.status(422).json({
        message: "Topic, standard and question config are required",
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
      Return structured JSON only where it has key sections which contain array as of oabjects as value. Each array element should have keys - section_name, is_mcq, questions. Now questions is also an array of elements where each element has keys - question, answer, difficulty-[easy/medium/hard], marks, options(in case of mcq and there should be exactly 4 options). Return this exact JSON only.
      `;

      if (typeof question_config === "string") {
        question_config = JSON.parse(question_config);
      }
    // 💾 Save assignment (pending state)
    const assignment = await Assignment.create({
      topic,
      standard,
      dueDate,
      question_config,
      additional_info,
      user: userId,
      prompt_sent: prompt,
      status: "pending",
      response_from_llm : {},
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      assignmentId: assignment._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};