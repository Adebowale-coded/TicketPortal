import React from "react";


type TopbarProps = {
  onMenuClick: () => void;
};
const Topbar = () => {
  return (
    <div className="w-full h-16 bg-white shadow px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Welcome Back</h1>
      <div className="text-sm text-gray-600">User | Logout</div>
    </div>
  );
};

export default Topbar;
