import EmptyState from "@/components/emptyState";
import MobileBottomNav from "@/components/mobileBottomNav";
import Navbar from "@/components/navBar";
import Sidebar from "@/components/sideBar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar (desktop only) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4">
          <EmptyState />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}