import React from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto mt-5 bg-white shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-10 border border-gray-200">
        {/* Avatar Section */}
        <div className="text-center md:text-left">
          <img
            className="w-28 h-28 md:w-32 md:h-32 rounded-md object-cover"
            src="https://i.pravatar.cc/150?img=32"
            alt="User avatar"
          />
          <h2 className="text-xl font-semibold mt-4">Jane Doe</h2>
          <p className="text-gray-500 text-sm">Frontend Developer</p>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-sm text-gray-700 space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-gray-400 text-xs">Email</p>
              <p className="font-medium text-sm">janedoe@example.com</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-gray-400 text-xs">Location</p>
              <p className="font-medium text-sm">Lagos, Nigeria</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-gray-400 text-xs">Member Since</p>
              <p className="font-medium text-sm">Jan 2023</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-gray-400 text-xs">Role</p>
              <p className="font-medium text-sm">Admin User</p>
            </div>
          </div>

          <div className="mt-6 text-center md:text-left">
            <button className="px-5 py-2 bg-green-600 text-white text-sm hover:bg-green-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
