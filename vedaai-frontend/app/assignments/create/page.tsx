"use client";

import FileUploadBox from "@/components/fileUpload";
import QuestionConfig from "@/components/questionConfig";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

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

    const handleSubmit = async () => {
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
            };

            await api.post("/assignments/create", payload);

            alert("Assignment created!");
            router.push("/assignments");

        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to create assignment");
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

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border p-2 rounded-xl"
                    />

                    <select
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                        className="border p-2 rounded-xl"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i}>{i + 1}</option>
                        ))}
                    </select>
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
                    placeholder="Additional instructions"
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
        </div>
    );
}