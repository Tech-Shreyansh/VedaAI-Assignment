'use client'

import AssignmentListing from "@/components/assignmentListing";
import EmptyState from "@/components/emptyState";
import { useState } from "react";

export default function DashboardPage() {

  const [assignments, setAssignments] = useState<Array<Object>>([]);

  return (
    
        <div className="px-4">
          {assignments?.length > 0 ? <AssignmentListing assignments={assignments} /> : <EmptyState />}
        </div>
  );
}