import DashboardLayout from '../../layouts/Dashboardlayouts';

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="flex md:flex-row flex-col items-center md:items-start gap-10 bg-white shadow-sm mx-auto mt-5 p-8 border border-gray-200 max-w-full">
        {/* Avatar Section */}
        <div className="md:text-left text-center">
          <img
            className="rounded-md w-28 md:w-32 h-28 md:h-32 object-cover"
            src="https://i.pravatar.cc/150?img=32"
            alt="User avatar"
          />
          <h2 className="mt-4 font-semibold text-xl">Jane Doe</h2>
          <p className="text-gray-500 text-sm">Frontend Developer</p>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4 w-full text-gray-700 text-sm">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Email</p>
              <p className="font-medium text-sm">janedoe@example.com</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Location</p>
              <p className="font-medium text-sm">Lagos, Nigeria</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Member Since</p>
              <p className="font-medium text-sm">Jan 2023</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Role</p>
              <p className="font-medium text-sm">Admin User</p>
            </div>
          </div>

          <div className="mt-6 md:text-left text-center">
            <button className="bg-green-600 hover:bg-green-700 px-5 py-2 text-white text-sm transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
