'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Assignment = {
    _id: string;
    topic: string;
    dueDate: string;
    createdAt: string;
};
interface Props {
    assignments: Assignment[],
    setAssignments: Dispatch<SetStateAction<Assignment[]>>
}
const AssignmentListing = (props: Props) => {
    const [visible, setVisible] = useState<boolean[]>(
        new Array(props.assignments.length).fill(false)
    );
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(props.assignments)
    const [search, setSearch] = useState("");

    useEffect(() => {
        const filtered = props.assignments.filter((a: any) =>
            a.topic.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredAssignments(filtered)
    }, [search])


    const toggleMenu = (index: number) => {
        setVisible((prev) =>
            prev.map((item, i) => (i === index ? !item : false))
        );
    };

    const router = useRouter()

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const res = await api.get(`/assignments/?userId=${userId}`);
            props.setAssignments(res.data.assignments);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAssignment = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/assignments/${id}`);
            toast.success("Assignment deleted successfully 🗑️");
            fetchData()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Delete failed");
        }
    };
    return <div className="my-8">
        <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-green-300 shadow-[0px_4px_4px_rgba(0,0,0,0.2)]">
                <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
            <div>
                <h3 className="font-bold text-xl text-left">Assignments</h3>
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
                <input onChange={(e) => setSearch(e.target.value)} className="focus:outline-none" placeholder="Search Assignment" />
            </div>
        </div>
        <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
            {filteredAssignments.map((assignment, index) => (
                <div
                    key={assignment._id}
                    className="relative w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-lg md:text-xl font-bold text-[#303030]">
                            {assignment.topic}
                        </span>

                        <Image
                            onClick={() => toggleMenu(index)}
                            className="cursor-pointer"
                            src={"/dotsVertical.svg"}
                            width={20}
                            height={20}
                            alt="menu"
                        />
                    </div>

                    {/* Dates */}
                    <div className="flex justify-between text-sm md:text-base font-medium text-black">
                        <p>
                            Assigned on:{" "}
                            <span className="text-gray-400">
                                {assignment.createdAt?.slice(0, 10)}
                            </span>
                        </p>

                        <p>
                            Due:{" "}
                            <span className="text-gray-400">
                                {assignment.dueDate}
                            </span>
                        </p>
                    </div>

                    {/* Dropdown */}
                    {visible[index] && (
                        <div className="absolute top-10 right-4 bg-white shadow-lg p-3 rounded-lg w-40 text-sm z-10">
                            <p onClick={() => router.push(`assignments/view/${assignment._id}`)} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                                View Assignment
                            </p>
                            <p onClick={() => deleteAssignment(assignment._id)} className="cursor-pointer hover:bg-red-50 text-red-500 px-2 py-1 rounded">
                                Delete
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>

}

export default AssignmentListing