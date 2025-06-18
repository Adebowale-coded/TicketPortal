import React from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or any user data
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // if you store JWT or auth token

    // Navigate to login page
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-white shadow px-6 flex items-center justify-between">
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
