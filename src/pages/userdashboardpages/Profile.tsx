import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    location: 'Unknown',
    role: '',
    department: '',
    memberSince: 'N/A',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const username = 'Alphadeskuser';
      const password = 'Qwerty1234';
      const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

      // Get actual username of logged-in user
      const storedUsername = localStorage.getItem('username'); // e.g., "john.doe"

      if (!storedUsername) {
        console.warn('Username not found in localStorage');
        return;
      }

      const url = `https://reportpool.alphamorganbank.com:8443/api/user/${storedUsername}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': basicAuth,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setUser({
          name: data.name || storedUsername,
          email: data.email || 'N/A',
          location: data.location || 'Unknown',
          role: data.role || 'User',
          department: data.department || 'N/A',
          memberSince: data.memberSince || 'N/A',
        });

      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex md:flex-row flex-col items-center md:items-start gap-10 bg-white shadow-sm mx-auto mt-5 p-8 border border-gray-200 max-w-full">
        {/* Avatar Section */}
        <div className="md:text-left text-center">
          <img
            className="rounded-md w-28 md:w-32 h-28 md:h-32 object-cover"
            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user.name}`}
            alt="User avatar"
          />
          <h2 className="mt-4 font-semibold text-xl">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.role}</p>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4 w-full text-gray-700 text-sm">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Email</p>
              <p className="font-medium text-sm">{user.email}</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Location</p>
              <p className="font-medium text-sm">Alpha Morgan Bank</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Department</p>
              <p className="font-medium text-sm">{user.department}</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200">
              <p className="text-gray-400 text-xs">Role</p>
              <p className="font-medium text-sm">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
