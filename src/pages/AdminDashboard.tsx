import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/Dashboardlayouts";
import axios from "axios";

interface Props {
  id: string;
  title: string;
  ticketDescription: string;
  ticketPriority: string; // inferred from "High"
  ticketStatus: string; // you can refine based on known values
  ticketSlaStatus: string;
  loggedTime: string; // ISO date string
  requesterName: string;
  requesterDept: string;
  responsibleName: string;
  responsibleDept: string;
  responsibleTeam: string;
  closureTime: string;
  closureComment: string;
  closedBy: string;
  attachment: string;
  comment: string;
  updatedStatus: string;
}

const AdminDashboard = () => {
  const [displayName, setDisplayName] = useState("");
  const closedName = localStorage.getItem("username");
  const [reports, setReports] = useState<Props[]>([]);

  const [update, setUpdate] = useState({
    closureComment: '',
    ticketStatus: ''
  })



  useEffect(() => {
    const fetchTickets = async () => {
      const username = 'Alphadeskuser';
      const password = 'Qwerty1234';
      const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
      try {
        const response = await axios.get(
          `https://reportpool.alphamorganbank.com:8443/api/tickets`,
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        );


        // Add default editable fields to each ticket
        const enrichedData = response.data.map((ticket: Props) => ({
          ...ticket,
          updatedStatus: ticket.ticketStatus || "Pending", // Fallback if status is null
          comment: ticket.closureComment || "",
          closedBy: ticket.closedBy || ""
        }));


        setReports(enrichedData); // Log actual data
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };


    fetchTickets();
  }, []);

  //GET USER NAME

  const rawUser = localStorage.getItem('username') || '';
  const user = rawUser
    .split('.')
    .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
    .join(' ');


  //PAGENATION STATE //PAGENATION STATE //PAGENATION STATE 

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  // Calculate indexes for current page
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Total pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);



  const handleInputChange = (index: number, field: keyof Props | "comment" | "updatedStatus", value: string) => {
    const updatedReports = [...reports];
    updatedReports[index][field] = value;
    setReports(updatedReports);
  };


  const handleUpdate = async (prevData: Props) => {
    const username = 'Alphadeskuser';
    const password = 'Qwerty1234';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    try {
      await axios.put(`https://reportpool.alphamorganbank.com:8443/api/tickets`, {
        ...prevData,
        ...update,
        closedBy:closedName,
        closureTime:new Date().toISOString().slice(0, 19)
      }, {
        headers: {
          Authorization: basicAuth,
        },
      });
      alert("Update successful!");
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Update failed.");
    }
  };


  // MOdal
  const [selectedTicket, setSelectedTicket] = useState<Props | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  return (
    <DashboardLayout>
      <h1 className="font-bold text-blue-600 text-2xl">Admin</h1>
      <p className="mt-4 text-gray-700">
        Welcome, <span className="font-semibold">{user}</span>. Here's a list of all requests raised against your team.
      </p>

      <div className="mt-8">
        <div className="pb-[10px]">
          <h2 className="font-bold text-[20px]">Ticketing</h2>
        </div>

        <div className="shadow border rounded-lg overflow-x-auto max-w-[1200px] ">
          <table className="bg-white min-w-full table-fixed ">
            <thead className="bg-gray-100 font-semibold text-gray-600 text-sm text-left">
              <tr>
                <th className="px-4 py-3">S/N</th> {/* 👈 New Column */}
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Requester Dept</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Responsible Person</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Logged Time</th>
                <th className="px-4 py-3">Closed By</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {currentReports.map((report, index) => (
                <tr key={report.id} className="even:bg-gray-50 border-t">
                  <td className="px-4 py-3 break-words whitespace-normal">
                    {((currentPage - 1) * reportsPerPage) + index + 1}
                  </td>

                  <td className="px-4 py-3 break-words whitespace-normal">{report.title}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.ticketDescription}</td>
                  <td className="px-4 py-3 break-words whitespace-normal font-medium text-orange-600">{report.ticketPriority}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.requesterDept}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.requesterName}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.responsibleTeam}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.responsibleName}</td>
                  <td className="px-4 py-3 break-words whitespace-normal">{report.ticketStatus}</td>
                  <td className="px-4 py-3 break-words whitespace-normal"> {report.loggedTime ? new Date(report.loggedTime).toLocaleString() : "N/A"}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Enter Closed By"
                      value={report.closedBy}
                      onChange={(e) => handleInputChange(index, "closedBy", e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    /></td>
                  {/* <td className="px-4 py-3">{report.comment}</td> */}


                  <td className="px-4 py-3 break-words whitespace-normal">
                    <input
                      type="text"
                      placeholder="Enter comment"
                      value={report.comment} // <-- this ensures it's synced with state
                      onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                      className="px-2 py-1 border rounded w-full"

                    />
                  </td>
                 

                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedTicket(report);
                        setIsModalOpen(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? 'bg-orange-500 text-white' : ''}`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>


        {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md w-full max-w-lg rounded-xl shadow-2xl border border-white/20 p-6 space-y-4 relative mx-4">
              <button
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-gray-800 pr-8">Update Ticket</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border">{selectedTicket.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border min-h-[60px]">{selectedTicket.ticketDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedTicket.ticketPriority}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <input
                    type="text"
                    value={update.closureComment}
                    onChange={(e) =>
                      setUpdate({ ...update, closureComment: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter your comment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={update.ticketStatus}
                    onChange={(e) =>
                      setUpdate({ ...update, ticketStatus: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(selectedTicket)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        )}



      </div>


      {/* <div className="pt-[20px]">
        <h2 className="font-bold text-[20px]">Incidence Report</h2>
        <div className="bg-white shadow-sm mt-4 p-6 border rounded max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // You can replace this with actual API POST
              alert("Incidence submitted successfully.");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Title</label>
              <input
                type="text"
                name="title"
                required
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                placeholder="e.g., VPN not connecting"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Description</label>
              <textarea
                name="description"
                rows={3}
                required
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Severity</label>
              <select
                name="severity"
                className="px-3 py-2 border border-gray-300 rounded w-full"
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
              <label className="block mb-1 font-medium text-gray-700 text-sm">Reported By</label>
              <input
                type="text"
                name="reportedBy"
                defaultValue={displayName}
                readOnly
                className="bg-gray-100 px-3 py-2 border rounded w-full text-gray-600"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white"
              >
                Submit Incidence
              </button>
            </div>
          </form>
        </div>

      </div> */}
    </DashboardLayout>
  );
};

export default AdminDashboard;