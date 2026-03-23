"use client";

import FileUploadBox from "@/components/fileUpload";
import QuestionConfig from "@/components/questionConfig";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

type Question = {
    type: string;
    count: number;
    marks: number;
};

export default function CreateAssignmentPage() {
    const router = useRouter();

    const [topic, setTopic] = useState("");
    const [standard, setStandard] = useState("1");
    const [dueDate, setDueDate] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [questionConfig, setQuestionConfig] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState<number>(0)

    const validateForm = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(dueDate);

        const oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear() + 1);

        // 1. Due date validation
        if (!dueDate) return "Due date is required";
        if (selectedDate < today) return "Due date cannot be in the past";
        if (selectedDate > oneYearLater) return "Due date cannot be more than 1 year ahead";

        // 2. Topic length
        if (!topic.trim()) return "Topic is required";
        if (topic.length > 50) return "Topic must be within 50 characters";

        // 3. Duration
        if (!duration || duration < 1 || duration > 5) {
            return "Duration must be between 1 to 5 hours";
        }

        // 4. Question config validation
        if (!questionConfig.length) return "Add at least one question type";

        let totalMarks = 0;

        for (let q of questionConfig) {
            if (q.count > 10) {
                return `Max 10 questions allowed for ${q.type}`;
            }

            totalMarks += q.count * q.marks;
        }

        // 5. Total marks
        if (totalMarks > 300) {
            return "Total marks cannot exceed 300";
        }

        return null; // all good
    };

    const handleSubmit = async () => {
        const error = validateForm();

        if (error) {
            toast.error(error)
            return;
        }

        try {
            setLoading(true);

            const userId = localStorage.getItem("userId");

            const payload = {
                topic,
                standard,
                dueDate,
                additional_info: additionalInfo,
                question_config: questionConfig,
                userId,
                duration,
            };

            const res = await api.post("/assignments/create", payload);

            toast.success("Assignment created!");
            router.push(`/assignments/view/${res.data.assignmentId}`);

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex justify-center items-center w-6 h-6 rounded-full bg-green-300 shadow">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                </div>
                <div>
                    <h3 className="font-bold text-xl">Create Assignment</h3>
                    <p className="text-sm text-gray-500">
                        Set up a new assignment
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div className="w-[95vw] md:w-[50vw] mx-auto bg-white/30 border p-8 space-y-6 rounded-xl">

                <FileUploadBox />

                {/* Date + Standard */}
                <div className="grid md:grid-cols-2 gap-4">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border p-2 rounded-xl"
                    />

                    <label>Class/Standard</label>
                    <select
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                        className="border p-2 rounded-xl"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i}>{i + 1}</option>
                        ))}
                    </select>

                    <label>Duration in hours</label>
                    <input
                        type="number"
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="border p-2 rounded-xl"
                    />
                </div>

                {/* Topic */}
                <input
                    placeholder="Enter topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border p-2 rounded-xl"
                />

                {/* Question Config */}
                <QuestionConfig setQuestionConfig={setQuestionConfig} />

                {/* Additional Info */}
                <textarea
                    rows={4}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Any Information? Example : Keep the questions moderate."
                    className="w-full border rounded-xl p-2"
                />

            </div>

            {/* BUTTON */}
            <div className="flex justify-center my-6">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-full"
                >
                    {loading ? "Generating..." : "⚡ Generate"}
                </button>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}