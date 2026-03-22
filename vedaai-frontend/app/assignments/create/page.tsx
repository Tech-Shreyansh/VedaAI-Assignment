'use client'
import FileUploadBox from "@/components/fileUpload";
import QuestionConfig from "@/components/questionConfid";
import { useState } from "react";

export default function CreateAssignmentPage() {

    return (
        <div className="">
            <div className="flex items-center gap-4 mb-8">
                <div className="flex justify-center items-center w-6 h-6 rounded-full bg-green-300 shadow-[0px_4px_4px_rgba(0,0,0,0.2)]">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-left">Create Assignment</h3>
                    <p className="text-sm text-gray-500">Set up a new assignment for your students</p>
                </div>
            </div>
            <div className="w-[50vw] rounded-xl mx-auto bg-white/30 border-2 border-white p-8 space-y-4">
                <div>
                    <h3 className="font-bold text-xl text-left">Assignment Details</h3>
                    <p className="text-sm text-gray-500">Basic information about your assignment</p>
                </div>
                <FileUploadBox />
                <div className="[&_label]:text-sm [&_label]:font-bold space-y-6">

                    {/* Row: Due Date + Standard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Due Date */}
                        <div>
                            <label className="block mb-1 text-gray-600">Due Date</label>
                            <input
                                type="date"
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Standard */}
                        <div>
                            <label className="block mb-1 text-gray-600">Choose Standard</label>
                            <select
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Topic */}
                    <div>
                        <label className="block mb-1 text-gray-600">Enter Topic</label>
                        <input
                            placeholder="Enter topic in 50 characters"
                            maxLength={50}
                            className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Max 50 characters
                        </p>
                    </div>

                    {/* Question Configuration */}
                    <QuestionConfig />

                    {/*  */}
                    <div>
                        <label className="block mb-1 text-gray-600">Additional Information (For better output)</label>
                        <textarea rows={4} placeholder="e.g Generate a question paper for 3 hour exam duration..."
                            className="resize-none w-full border-2 border-dashed border-gray-300 bg-white rounded-xl px-3 py-2 focus:outline-none transition" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center my-4">
                <button
                    className="w-full md:w-auto flex items-center justify-center gap-2 
    bg-black text-white px-6 py-3 rounded-full font-medium
    hover:opacity-90 active:scale-[0.98] transition
    shadow-[0px_8px_20px_rgba(0,0,0,0.15)]"
                >
                    ⚡ Generate
                </button>
            </div>
        </div>
    );
}