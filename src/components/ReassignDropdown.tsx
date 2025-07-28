import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";

// Define the User interface
interface User {
  email: string;
  name: string;
  department: string;
}

interface ReassignDropdownProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ReassignDropdown: React.FC<ReassignDropdownProps> = ({ value, onChange }) => {
  // Properly type the users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const username = 'Alphadeskuser';
      const password = 'Qwerty1234';
      const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

      try {
        const response = await axios.get<User[]>(
          `https://reportpool.alphamorganbank.com:8443/api/itusers`,
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Reassign</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
      >
        <option value="">Select a user</option>
        {loading ? (
          <option>Loading...</option>
        ) : (
          users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.name} - {user.department}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ReassignDropdown;