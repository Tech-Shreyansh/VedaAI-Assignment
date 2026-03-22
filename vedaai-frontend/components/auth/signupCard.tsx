"use client";

import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import Image from "next/image";
import api from "@/lib/axios";

interface Props {
    setIsOtpSent : Dispatch<SetStateAction<boolean>>;
}

const SignupPageCard = (props : Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirm) {
      return alert("All fields are required");
    }

    if (password !== confirm) {
      return alert("Passwords do not match");
    }
    var res;
    try {
      setLoading(true);

      res = await api.post(
        "/auth/send-otp",
        { email, type:"signup" }
      );
      
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("flow", "signup");
      props.setIsOtpSent(true)
    } catch {
      alert(res?.data.message);
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
          AI-powered assessment creator
        </p>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[#303030] mb-6 text-center">
        Create your account
      </h2>

      {/* Email */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">Password</label>
        <input
          type="password"
          placeholder="Create password"
          className="w-full p-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-1 block">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Re-enter password"
          className="w-full p-3 border border-gray-200 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSignup}
        disabled={loading}
        className="cursor-pointer w-full bg-[#303030] text-white py-3 rounded-xl 
        font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Continue"}
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-sm text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Login CTA */}
      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <span
          className="text-indigo-600 font-medium cursor-pointer hover:underline"
          onClick={() => (window.location.href = "/auth/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupPageCard;