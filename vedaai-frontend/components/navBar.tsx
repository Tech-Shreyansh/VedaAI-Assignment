'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter()
  return (
    <div className="mt-[3vh] mx-2 md:ml-0 md:mr-4 rounded-2xl h-16 bg-white shadow-[0px_16px_16px_0px_rgba(0,0,0,0.2),0px_16px_16px_0px_rgba(0,0,0,0.12)] flex items-center justify-between px-4">

      {/* For Mobile Only */}
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/brandLogo.svg" width={30} height={30} alt="logo" />
        <span className="font-bold text-lg">VedaAI</span>
      </div>

      {/* Left */}
      <div className="hidden md:flex items-center gap-4 text-gray-700">
        <Image onClick={() => router.replace("/assignments")} className="cursor-pointer" src={"/leftArrow.svg"} height={20} width={20} alt="back" />
        <Image className="cursor-pointer" src={"/homeIcon.svg"} height={20} width={20} alt="home" />
        <span className="text-gray-500 font-bold">Assignment</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Image className="cursor-pointer" src={"/bellIcon.svg"} width={20} height={20} alt="notification" />
        <div className="flex items-center gap-2">
          <Image src={"/avatar.svg"} width={30} height={30} alt="avatar" />
          <span className="hidden md:block ">John Doe</span>
          <Image className="md:hidden" src={"/hamburger.svg"} width={30} height={30} alt="avatar" />
        </div>
        <Image className="hidden md:block cursor-pointer" src={"/downArrow.svg"} width={15} height={15} alt="expand" />
      </div>
    </div>
  );
}