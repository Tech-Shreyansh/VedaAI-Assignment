// app/assignments/layout.tsx

import MobileBottomNav from "@/components/mobileBottomNav";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/sideBar";

export default function AssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}