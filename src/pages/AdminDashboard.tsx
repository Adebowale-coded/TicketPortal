import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/Dashboardlayouts";
import axios from "axios";

const AdminDashboard = () => {
  const [displayName, setDisplayName] = useState("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://reportpool.alphamorganbank.com:8443/api/user/${username}`
        );
        const fullName = response.data.displayName;
        const firstName = fullName.split(" ")[0];
        setDisplayName(firstName);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Network Issue",
      description: "Unable to connect to VPN",
      priority: "High",
      requesterDept: "Finance",
      requesterName: "John Doe",
      responsibleDept: "IT",
      responsibleTeam: "Network Support",
      status: "Pending",
      loggedTime: "2025-06-04 10:45",
      closedBy: "-",
      comment: "",
      updatedStatus: "Pending",
    },
    {
      id: 2,
      title: "Email Issue",
      description: "Unable to send emails externally",
      priority: "Medium",
      requesterDept: "Operations",
      requesterName: "Jane Smith",
      responsibleDept: "IT",
      responsibleTeam: "Email Support",
      status: "In Progress",
      loggedTime: "2025-06-03 08:22",
      closedBy: "-",
      comment: "",
      updatedStatus: "In Progress",
    },
    {
      id: 3,
      title: "System Crash",
      description: "Core banking application not responding",
      priority: "Critical",
      requesterDept: "IT",
      requesterName: "Michael Kings",
      responsibleDept: "IT",
      responsibleTeam: "Core App Support",
      status: "Resolved",
      loggedTime: "2025-06-02 14:10",
      closedBy: "AdminUser",
      comment: "",
      updatedStatus: "Resolved",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedReports = [...reports];
    updatedReports[index][field] = value;
    setReports(updatedReports);
  };

  const handleUpdate = (index) => {
    const updatedReport = reports[index];
    console.log("Updating report:", updatedReport);

    // You can replace this with a real API request later
    alert(
      `Updated Request "${updatedReport.title}" with status "${updatedReport.updatedStatus}" and comment "${updatedReport.comment}"`
    );
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-blue-600">Admin</h1>
      <p className="mt-4 text-gray-700">
        Welcome, <span className="font-semibold">{displayName || "Admin"}</span>. Here’s a list of all requests raised against your team.
      </p>

      <div className="mt-8">
        <div className="pb-[10px]">
          <h2 className="font-bold text-[20px]">Ticketing</h2>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-sm font-semibold text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Requester Dept</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Logged Time</th>
                <th className="px-4 py-3">Closed By</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Update Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {reports.map((report, index) => (
                <tr key={report.id} className="border-t even:bg-gray-50">
                  <td className="px-4 py-3">{report.title}</td>
                  <td className="px-4 py-3">{report.description}</td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{report.priority}</td>
                  <td className="px-4 py-3">{report.requesterDept}</td>
                  <td className="px-4 py-3">{report.requesterName}</td>
                  <td className="px-4 py-3">{report.responsibleTeam}</td>
                  <td className="px-4 py-3">{report.status}</td>
                  <td className="px-4 py-3">{report.loggedTime}</td>
                  <td className="px-4 py-3">{report.closedBy}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={report.comment}
                      onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                      placeholder="Enter comment"
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={report.updatedStatus}
                      onChange={(e) => handleInputChange(index, "updatedStatus", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUpdate(index)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="pt-[20px]">
        <h2 className="font-bold text-[20px]">Incidence Report</h2>
        <div className="mt-4 max-w-4xl bg-white border p-6 rounded shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // You can replace this with actual API POST
              alert("Incidence submitted successfully.");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., VPN not connecting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                name="severity"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
              <input
                type="text"
                name="reportedBy"
                defaultValue={displayName}
                readOnly
                className="w-full border bg-gray-100 text-gray-600 rounded px-3 py-2"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Submit Incidence
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
