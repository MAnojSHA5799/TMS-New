"use client";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-gray-100">
      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-[#CC375D] tracking-wide">
        GullySystem Fleet Management Admin
      </h1>

      {/* User Section */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">
            Hi, <span className="text-[#CC375D]">{user.username}</span>
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-[#CC375D] text-white px-4 py-2 rounded-lg hover:bg-[#b53052] transition-colors duration-200"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
