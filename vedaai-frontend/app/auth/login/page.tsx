"use client";

import ResetEmailCard from "@/components/auth/emailCard";
import LoginPageCard from "@/components/auth/loginPageCard";
import OtpCard from "@/components/otpCard";
import { useState } from "react";

export default function LoginPage() {
  const [isResetActive, setIsResetActive] = useState<boolean>(false)
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      
      {/* Login Card */}
      {!isResetActive && <LoginPageCard setIsResetActive={setIsResetActive} />}

      {/* Forgot Password */}
      {isResetActive && !isOtpSent && <ResetEmailCard setIsResetActive={setIsResetActive} setIsOtpSent={setIsOtpSent} />}

      {isResetActive && isOtpSent && <OtpCard/>}
    </div>
  );
}