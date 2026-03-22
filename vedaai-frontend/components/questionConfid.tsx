"use client";

import Image from "next/image";
import { useState } from "react";

const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Numerical Problems",
];

export default function QuestionConfig() {
  const [questions, setQuestions] = useState([
    { type: QUESTION_TYPES[0], count: 1, marks: 1 },
  ]);

  const handleAdd = () => {
    setQuestions((prev) => [
      ...prev,
      { type: QUESTION_TYPES[0], count: 1, marks: 1 },
    ]);
  };

  const handleRemove = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateValue = (
    index: number,
    field: "count" | "marks",
    delta: number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, [field]: Math.max(1, q[field] + delta) }
          : q
      )
    );
  };

  const updateType = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, type: value } : q))
    );
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
        <span className="col-span-2 font-bold text-black">Question Type</span>
        <span className="text-center">No. of Questions</span>
        <span className="text-center">Marks</span>
      </div>

      {/* Rows */}
      {questions.map((q, index) => (
        <div key={index} className="grid grid-cols-4 gap-3 items-center">

          {/* Dropdown */}
          <div className="col-span-2 w-4/5 flex items-center gap-2">
            <select
              value={q.type}
              onChange={(e) => updateType(index, e.target.value)}
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm 
              focus:outline-none"
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <button
              onClick={() => handleRemove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <Image src={"/cross.svg"} width={15} height={15} alt="remove" />
            </button>
          </div>

          {/* Count */}
          <div className="flex justify-center">
            <div className="flex bg-white items-center bg-gray-100 rounded-full px-3 py-1 gap-3">
              <button onClick={() => updateValue(index, "count", -1)}>
                −
              </button>
              <span>{q.count}</span>
              <button onClick={() => updateValue(index, "count", 1)}>
                +
              </button>
            </div>
          </div>

          {/* Marks */}
          <div className="flex justify-center">
            <div className="flex bg-white items-center bg-gray-100 rounded-full px-3 py-1 gap-3">
              <button onClick={() => updateValue(index, "marks", -1)}>
                −
              </button>
              <span>{q.marks}</span>
              <button onClick={() => updateValue(index, "marks", 1)}>
                +
              </button>
            </div>
          </div>

        </div>
      ))}

      {/* Add */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <span className="w-6 h-6 flex items-center justify-center bg-black text-white rounded-full">
          +
        </span>
        Add Question Type
      </button>
    </div>
  );
}