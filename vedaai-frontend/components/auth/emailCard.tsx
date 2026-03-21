"use client";

import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Props {
  setIsResetActive: Dispatch<SetStateAction<boolean>>;
  setIsOtpSent: Dispatch<SetStateAction<boolean>>;
}

const ResetEmailCard = (props : Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return alert("Email is required");

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/send-otp`,
        { email }
      );

      localStorage.setItem("resetEmail", email);
      localStorage.setItem("flow", "reset");
      props.setIsOtpSent(true)
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="[&_label]:font-semibold w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      
      {/* Branding */}
      <div className="mb-6 text-center">
        <div className="flex mx-auto justify-center items-center gap-2">
          <Image src={"/brandLogo.svg"} width={30} height={30} alt="VedaAI" />
          <h1 className="text-3xl font-bold text-[#303030]">VedaAI</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Reset your password
        </p>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[#303030] mb-6 text-center">
        Forgot your password?
      </h2>

      {/* Email Field */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-1 block">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
        />

        <p className="text-xs text-gray-400 mt-2">
          We’ll send a verification code to this email
        </p>
      </div>

      {/* Button */}
      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="cursor-pointer w-full bg-[#303030] text-white py-3 rounded-xl 
        font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      {/* Back to login */}
      <p className="text-sm text-center text-gray-500 mt-6">
        Remember your password?{" "}
        <span
          className="text-indigo-600 font-medium cursor-pointer hover:underline"
          onClick={() => props.setIsResetActive(false)}
        >
          Back to login
        </span>
      </p>
    </div>
  );
};

export default ResetEmailCard;