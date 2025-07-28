import React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../assets/imgs/Menubtn.png"; // Make sure this path is correct

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-white shadow px-6 flex items-center justify-between">
      {/* Menu Button - show only on small screens */}
      <img
        src={Menu}
        alt="Menu"
        className="w-6 h-6 cursor-pointer md:hidden"
        onClick={onMenuClick}
      />

      <h1 className="text-lg font-semibold">Welcome Back</h1>

      <div
        className="text-sm text-gray-600 cursor-pointer hover:underline"
        onClick={handleLogout}
      >
        User | Logout
      </div>
    </div>
  );
};

export default Topbar;
