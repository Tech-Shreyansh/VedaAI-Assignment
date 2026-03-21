"use client";

import SignupPageCard from "@/components/auth/signupCard";
import OtpCard from "@/components/otpCard";
import { useState } from "react";

export default function SignUpPage() {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      
      {/*SignUp Card */}
      {!isOtpSent && <SignupPageCard setIsOtpSent={setIsOtpSent}/>}

      {/* OTP Card */}
      {isOtpSent && <OtpCard />}
    </div>
  );
}