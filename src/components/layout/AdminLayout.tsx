
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Users, 
  FileCheck, 
  Settings, 
  Menu, 
  X, 
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/organizers", label: "Organizers", icon: <Users size={20} /> },
    { path: "/admin/agreements", label: "Agreements", icon: <FileText size={20} /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white shadow-md transition-all duration-300 ease-in-out z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && <h1 className="font-bold text-xl text-blue-800">Admin Panel</h1>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100",
                    !sidebarOpen && "justify-center"
                  )}
                  end={item.path === "/admin"}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
