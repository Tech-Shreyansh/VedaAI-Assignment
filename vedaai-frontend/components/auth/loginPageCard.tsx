"use client";

import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import Image from "next/image";


interface Props {
    setIsResetActive: Dispatch<SetStateAction<boolean>>;
  }

const LoginPageCard = (props : Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return alert("Email and password are required");
        }

        try {
            setLoading(true);

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });

            window.location.href = "/";
        } catch {
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };
    return <div className="[&_label]:font-semibold w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">

        {/* Logo / Branding */}
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
            Welcome back
        </h2>

        {/* Email Field */}
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

        {/* Password Field */}
        <div className="mb-2">
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-200 rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
            <span
                className="text-sm text-indigo-600 cursor-pointer hover:underline"
                onClick={() => props.setIsResetActive(true)}
            >
                Forgot password?
            </span>
        </div>

        {/* Login Button */}
        <button
            onClick={handleLogin}
            disabled={loading}
            className="cursor-pointer w-full bg-[#303030] text-white py-3 rounded-xl 
      font-medium hover:opacity-90 transition disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Signup CTA */}
        <p className="text-sm text-center text-gray-500">
            New to VedaAI?{" "}
            <span
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
                onClick={() => (window.location.href = "/auth/email")}
            >
                Create an account
            </span>
        </p>
    </div>
}

export default LoginPageCard