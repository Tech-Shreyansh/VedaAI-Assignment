"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function FileUploadBox() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // validation (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      
      {/* Upload Box */}
      {!file ? (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 rounded-2xl 
          bg-gray-50 hover:bg-gray-100 transition 
          h-[180px] flex flex-col items-center justify-center text-center cursor-pointer"
        >
          {/* Icon */}
          <div className="mb-3">
            <Image src="/upload.svg" width={24} height={24} alt="upload" />
          </div>

          {/* Text */}
          <p className="text-gray-700 font-medium">
            Choose a file to give reference
          </p>

          <p className="text-gray-400 text-sm mt-1">
            JPEG, PNG, up to 10MB
          </p>

          {/* Button */}
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
          >
            Browse Files
          </button>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        // ✅ Uploaded State
        <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-center justify-between">
          
          {/* File Info */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              📄
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={handleClick}
              className="text-indigo-600 hover:underline"
            >
              Re-upload
            </button>

            <button
              onClick={handleRemove}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}

      {/* Footer */}
      {!file && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Upload images of your preferred document/image
        </p>
      )}
    </div>
  );
}