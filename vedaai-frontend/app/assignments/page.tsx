"use client";

import AssignmentListing from "@/components/assignmentListing";
import EmptyState from "@/components/emptyState";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await api.get(`/assignments/?userId=${userId}`);
        setAssignments(res.data.assignments);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="px-4">
      {assignments.length > 0 ? (
        <AssignmentListing assignments={assignments} setAssignments = {setAssignments} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}