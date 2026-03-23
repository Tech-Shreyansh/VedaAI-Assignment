"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

/* ================= TYPES ================= */

type Question = {
    question: string;
    difficulty: string;
    marks: number;
    options?: string[];
    answer?: string;
};

type Section = {
    section_name: string;
    instruction?: string;
    is_mcq: boolean;
    questions: Question[];
};

type Assignment = {
    _id: string;
    topic: string;
    standard: string;
    duration?: string;
    response_from_llm: {
        sections: Section[];
    };
};

/* ================= COMPONENT ================= */

export default function AssignmentDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAnswers, setShowAnswers] = useState(false);

    const pdfRef = useRef<HTMLDivElement | null>(null);

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await api.get(`/assignments/${id}`);
                setAssignment(res.data.assignment);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAssignment();
    }, [id]);

    /* ================= PDF ================= */

    const downloadPDF = async (withAnswers: boolean) => {
        const html2pdf = (await import("html2pdf.js")).default;
      
        const element = pdfRef.current;
        if (!element) return;
      
        const clone = element.cloneNode(true) as HTMLElement;
      
        // ===== FIX 1: HANDLE ANSWERS =====
        const answers = clone.querySelectorAll(".answer-block");
      
        answers.forEach((el) => {
          const htmlEl = el as HTMLElement;
      
          if (withAnswers) {
            htmlEl.style.display = "block";
            htmlEl.style.visibility = "visible";
            htmlEl.style.opacity = "1";
          } else {
            htmlEl.remove();
          }
        });
      
        // ===== FIX 2: FORCE REMOVE ALL MODERN COLORS =====
        clone.querySelectorAll("*").forEach((el) => {
          const htmlEl = el as HTMLElement;
      
          // force safe colors
          htmlEl.style.color = "#000";
          htmlEl.style.backgroundColor = "#fff";
          htmlEl.style.borderColor = "#ccc";
      
          // remove gradients / fancy styles
          htmlEl.style.boxShadow = "none";
          htmlEl.style.textShadow = "none";
        });
      
        // ===== FIX 3: CLEAN CONFIG =====
        const opt = {
          margin: 0.5,
          filename: withAnswers ? `assignment-${assignment?.topic}-qna.pdf` : `assignment-${assignment?.topic}.pdf`,
          image: { type: "jpeg" as const, quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "in" as const,
            format: "a4" as const,
            orientation: "portrait" as const,
          },
        };
      
        html2pdf().set(opt).from(clone).save();
      };

    /* ================= STATES ================= */

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!assignment) {
        return <p className="text-center mt-10">Assignment not found</p>;
    }

    /* ================= CALCULATIONS ================= */

    const totalMarks = assignment.response_from_llm.sections.reduce(
        (acc, sec) =>
            acc + sec.questions.reduce((sum, q) => sum + q.marks, 0),
        0
    );

    /* ================= Regenrate Paper ================= */
    const regenerate = async () => {
        setLoading(true)
        try {
            const res = await api.patch(`/assignments/${id}`);
            setAssignment(res.data.assignmentNew);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /* ================= UI ================= */

    return (
        <div className="max-w-4xl mx-auto">

            {/* ===== ACTION BAR ===== */}
            <div className="flex gap-3 mb-6 justify-center flex-wrap">
                <button
                    onClick={() => downloadPDF(false)}
                    className="cursor-pointer px-4 py-2 bg-black text-white rounded-full text-sm"
                >
                    Download Questions
                </button>

                <button
                    onClick={() => downloadPDF(true)}
                    className="cursor-pointer px-4 py-2 border border-black rounded-full text-sm"
                >
                    Download QnA
                </button>

                <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-full text-sm"
                >
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>
            </div>

            {/* ===== PDF CONTENT ===== */}
            <div
                ref={pdfRef}
                className="bg-white p-8 rounded-2xl shadow-md print:shadow-none"
            >

                {/* HEADER */}
                <div className="text-center border-b pb-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-500">
                        Delhi Public School
                    </h2>

                    <h1 className="text-2xl font-bold text-[#303030] mt-1">
                        {assignment.topic}
                    </h1>

                    <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600 flex-wrap">
                        <span><b>Standard:</b> {assignment.standard}</span>
                        <span><b>Duration:</b> {assignment.duration + " Hour(s)" || "1 Hour"}</span>
                        <span><b>Total Marks:</b> {totalMarks}</span>
                    </div>
                </div>

                {/* STUDENT INFO */}
                <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                    <input placeholder="Name" className="border-b p-2 outline-none" />
                    <input placeholder="Roll No." className="border-b p-2 outline-none" />
                    <input placeholder="Section" className="border-b p-2 outline-none" />
                </div>

                {/* SECTIONS */}
                {assignment.response_from_llm.sections.map((section, i) => (
                    <div key={i} className="mb-10">

                        <h2 className="text-lg font-semibold text-[#303030] mb-2">
                            {section.section_name}
                        </h2>

                        <div className="space-y-5">
                            {section.questions.map((q, index) => (
                                <div key={index} className="space-y-2">

                                    {/* QUESTION */}
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-sm">
                                            {index + 1}. {q.question}
                                        </p>

                                        <div className="flex gap-2">

                                            <span
                                                className={`text-xs px-2 py-1 rounded-full capitalize ${q.difficulty === "easy"
                                                    ? "bg-green-100 text-green-600"
                                                    : q.difficulty === "medium"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {q.difficulty}
                                            </span>

                                            <span className="text-sm font-medium">
                                                {q.marks}M
                                            </span>
                                        </div>
                                    </div>

                                    {/* OPTIONS */}
                                    {Array.isArray(q.options) && (
                                        <div className="pl-6 grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                                            {q.options.map((opt, i) => (
                                                <div key={i}>
                                                    {String.fromCharCode(65 + i)}. {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ANSWER */}
                                    {q.answer && (
                                        <div
                                            className="answer-block pl-6 text-sm text-green-700 font-medium"
                                            style={{ display: showAnswers ? "block" : "none" }}
                                        >
                                            Answer: {q.answer}
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== ACTION BAR ===== */}
            <div className="flex gap-3 my-6 justify-center flex-wrap">
                <button
                    onClick={() => downloadPDF(false)}
                    className="cursor-pointer px-4 py-2 bg-black text-white rounded-full text-sm"
                >
                    Download Questions
                </button>

                <button
                    onClick={() => downloadPDF(true)}
                    className="cursor-pointer px-4 py-2 border border-black rounded-full text-sm"
                >
                    Download QnA
                </button>

                <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-full text-sm"
                >
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>

                <button
                    onClick={regenerate}
                    className="cursor-pointer px-4 py-2 bg-black text-white rounded-full text-sm"
                >
                    Regenerate
                </button>
            </div>
        </div>
    );
}