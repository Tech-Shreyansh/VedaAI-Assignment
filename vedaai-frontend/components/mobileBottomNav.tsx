'use client'

import Image from "next/image"
import { useState } from "react";

export default function MobileBottomNav() {

  const [active, setActive] = useState("assignments");

  const items = [
    { key: "home", label: "Home", icon: "/homeIcon.svg" },
    { key: "assignments", label: "Assignments", icon: "/assignmentsIcon.svg" },
    { key: "library", label: "Library", icon: "/libraryMobile.svg" },
    { key: "toolkit", label: "Toolkit", icon: "/toolkitMobile.svg" },
  ];

  return (
    <>
      {/* Floating button */}
      <button className="fixed bottom-24 right-4 w-12 h-12 bg-white text-orange-500 rounded-full shadow-lg">
        <Image className="mx-auto" src={"plus.svg"} width={20} height={20} alt="add"/>
      </button>

      {/* Bottom bar */}
      <div className="fixed bottom-4 left-4 right-4 bg-black text-white rounded-2xl shadow-lg px-2 py-3">
        <div className="flex justify-around items-center">
          {items.map((item) => {
            const isActive = active === item.key;

            return (
              <div
                key={item.key}
                onClick={() => setActive(item.key)}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Image
                  src={item.icon}
                  width={18}
                  height={18}
                  alt={item.label}
                  className={`transition ${isActive ? "opacity-100" : "opacity-60"
                    }`}
                />

                <span
                  className={`text-[11px] ${isActive ? "font-semibold text-white" : "text-gray-400"
                    }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}