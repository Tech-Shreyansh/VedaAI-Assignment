'use client'

import { useState } from "react";
import Image from "next/image";

interface Props {
    assignments: Object[]
}
const AssignmentListing = (props: Props) => {
    const [visible, setVisible] = useState<boolean[]>(
        new Array(props.assignments.length).fill(false)
    );

    const toggleMenu = (index: number) => {
        setVisible((prev) =>
            prev.map((item, i) => (i === index ? !item : false))
        );
    };

    return <div className="my-8">
        <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-green-300 shadow-[0px_4px_4px_rgba(0,0,0,0.2)]">
                <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
            <div>
                <h3 className="font-bold text-2xl text-left">Assignments</h3>
                <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
            </div>
        </div>
        <div className="flex bg-white w-full p-2 my-4 rounded-xl justify-between">
            <div className="flex items-center gap-2">
                <Image src={"/filter.svg"} width={20} height={20} alt="filter" />
                <span className="text-gray-500">Filter By</span>
            </div>
            <div className="flex gap-2 rounded-full md:w-[30%] border-2 border-gray-200 p-2">
                <Image className="" src={"/search.svg"} width={20} height={20} alt="search" />
                <input className="focus:outline-none" placeholder="Search Assignment" />
            </div>
        </div>
        <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
            {props.assignments.map((assignment, index) => <div key={index} className="relative w-full bg-white rounded-xl p-4">
                <div className="flex justify-between mb-8">
                    <span className="text-2xl font-extrabold text-black">Quiz on Electricity</span>
                    <Image onClick={() => toggleMenu(index)} className="cursor-pointer" src={"/dotsVertical.svg"} width={20} height={20} alt="list" />
                </div>
                <div className="flex justify-between text-black font-bold">
                    <p>Assigned on : <span className="text-gray-400">20-06-2025</span></p>
                    <p>Due : <span className="text-gray-400">21-06-2025</span></p>
                </div>
                {visible[index] && <div className="absolute top-4 right-16 bg-white drop-shadow-md p-2 rounded-lg w-[30%] text-xs md:text-sm">
                    <p>View Assignment</p>
                    <p className="text-red-500">Delete</p>
                </div>}
            </div>)}
        </div>
    </div>

}

export default AssignmentListing