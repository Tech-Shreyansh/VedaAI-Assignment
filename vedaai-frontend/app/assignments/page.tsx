'use client'

import AssignmentListing from "@/components/assignmentListing";
import EmptyState from "@/components/emptyState";
import MobileBottomNav from "@/components/mobileBottomNav";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/sideBar";
import { useState } from "react";

export default function DashboardPage() {

  const [assignments, setAssignments] = useState<Array<Object>>([]);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar (desktop only) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-4">
          {assignments?.length > 0 ? <AssignmentListing assignments={assignments} /> : <EmptyState />}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}