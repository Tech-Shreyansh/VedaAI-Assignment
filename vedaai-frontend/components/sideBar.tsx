'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {

    const [active, setActive] = useState("assignments");
    const router = useRouter()
    const menuItems = [
        { key: "home", label: "Home", icon: "/homeIcon.svg" },
        { key: "groups", label: "My Groups", icon: "/myGroupsIcon.svg" },
        { key: "assignments", label: "Assignments", icon: "/assignmentsIcon.svg" },
        { key: "toolkit", label: "AI Teacher Toolkit", icon: "/toolkitIcon.svg" },
        { key: "library", label: "My Library", icon: "/libraryIcon.svg" },
    ];

    return (
        <div className="w-[20vw] h-[94vh] mt-[3vh] rounded-xl shadow-[0px_32px_48px_0px_rgba(0,0,0,0.2),0px_16px_48px_0px_rgba(0,0,0,0.12)] mx-4 bg-white p-4 flex flex-col justify-between">

            {/* Top */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Image src="/brandLogo.svg" width={30} height={30} alt="logo" />
                    <span className="font-bold text-lg">VedaAI</span>
                </div>

                <div className="p-[4px] rounded-full bg-gradient-to-b from-[#FF7950] to-[#C0350A] mb-6">
                    <button onClick={()=>router.push("/assignments/create")} className="w-full bg-[#303030] text-white py-2 rounded-full">
                        + Create Assignment
                    </button>
                </div>

                <nav className="space-y-2 text-sm sm">
                    {menuItems.map((item) => {
                        const isActive = active === item.key;

                        return (
                            <div
                                key={item.key}
                                onClick={() => setActive(item.key)}
                                className={`
              flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
              ${isActive
                                        ? "bg-gray-100 text-[#303030] font-medium"
                                        : "text-gray-500 hover:bg-gray-100"}
            `}
                            >
                                <Image
                                    src={item.icon}
                                    height={20}
                                    width={20}
                                    alt={item.label}
                                    className={`${isActive ? "opacity-100" : "opacity-70"}`}
                                />

                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom */}
            <div className="text-sm text-gray-500 space-y-4">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition hover:bg-gray-100">
                    <Image className="" src={"/settings.svg"} width={20} height={20} alt="settings" />
                    <span>Settings</span>
                </div>
                <div className="flex gap-2 bg-gray-100 p-2 rounded-xl items-center">
                    <Image className="m-1" src={"/avatar.svg"} width={50} height={50} alt="settings" />
                    <div>
                        <span className="font-extrabold text-black">Delhi Public School</span><br/>
                        <span>Bokaro Steel City</span>
                    </div>
                </div>
            </div>
        </div>
    );
}