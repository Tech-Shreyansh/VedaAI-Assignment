"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const OtpCard = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter()
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : "";
  const password =
    typeof window !== "undefined" ? localStorage.getItem("password") : "";

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = digit;
      }
    });
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
  
    if (finalOtp.length !== 6) {
      return alert("Enter valid OTP");
    }
  
    const flow = localStorage.getItem("flow"); // "signup" | "reset"
  
    try {
      setLoading(true);
  
      // Step 1: Verify OTP
      await api.post(`/auth/verify-otp`, {
        email,
        otp: finalOtp,
      });
  
      // Step 2: Conditional Flow
      if (flow === "signup") {
        await api.post(
          `/auth/signup`,
          { email, password }
        );
  
        alert("Account verified!");
        router.push("/assignments")
      }
  
      if (flow === "reset") {
        router.push("/login/reset");
      }
  
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      
      {/* Branding */}
      <div className="mb-6 text-center">
        <div className="flex mx-auto justify-center items-center gap-2">
          <Image src={"/brandLogo.svg"} width={30} height={30} alt="VedaAI" />
          <h1 className="text-3xl font-bold text-[#303030]">VedaAI</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Enter the verification code
        </p>
      </div>

      {/* OTP Inputs */}
      <div
        className="flex justify-between gap-2 mb-6"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full cursor-pointer bg-[#303030] text-white py-3 rounded-xl 
        font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {/* Resend */}
      <p className="text-sm text-center text-gray-500 mt-4">
        Didn’t receive code?{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">
          Resend
        </span>
      </p>
    </div>
  );
};

export default OtpCard;