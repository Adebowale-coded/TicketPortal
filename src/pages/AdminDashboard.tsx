import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/Dashboardlayouts";
import ReassignDropdown from "../components/ReassignDropdown";
import axios from "axios";
import { Search } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const closedName = localStorage.getItem("username");
  const [reports, setReports] = useState<Props[]>([]);



  // Updated state object with assignedTo field
  const [update, setUpdate] = useState({
    closureComment: '',
    ticketStatus: '',
    assignedTo: ''  // Add this field for reassignment
  })

  useEffect(() => {
    const fetchTickets = async () => {
      const username = 'AlphadeskTestuser';
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
  const pageSize = 10;
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handleInputChange = (index: number, field: keyof Props | "comment" | "updatedStatus", value: string) => {
    const updatedReports = [...reports];
    updatedReports[index][field] = value;
    setReports(updatedReports);
  };

  const handleUpdate = async (prevData: Props) => {
    const username = 'AlphadeskTestuser';
    const password = 'Qwerty1234';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    try {
      await axios.put(`https://reportpool.alphamorganbank.com:8443/api/tickets`, {
        ...prevData,
        ...update,
        closedBy: closedName,
        responsibleName: update.assignedTo || prevData.responsibleName,
        closureTime: new Date().toISOString().slice(0, 19)
      }, {
        headers: {
          Authorization: basicAuth,
        },
      });
      setShowSuccessModal(true); // Show success modal

      // Auto-close modal after 3 seconds
      setTimeout(() => setShowSuccessModal(false), 3000);
      setSubmitted(true);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Update failed.");
    }
  };

  // MOdal
  const [selectedTicket, setSelectedTicket] = useState<Props | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(reports); // tickets = your full list

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredTickets(reports);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickets(reports);
      return;
    }

    const query = searchQuery.toLowerCase();

    const results = reports.filter(report =>
      report.id?.toLowerCase().includes(query) ||
      report.title?.toLowerCase().includes(query) ||
      report.ticketDescription?.toLowerCase().includes(query) ||
      report.ticketPriority?.toLowerCase().includes(query) ||
      report.requesterDept?.toLowerCase().includes(query) ||
      report.requesterName?.toLowerCase().includes(query) ||
      report.responsibleTeam?.toLowerCase().includes(query) ||
      report.ticketStatus?.toLowerCase().includes(query)
    );

    setFilteredTickets(results);
  }, [searchQuery, reports]);



  return (
    <DashboardLayout>
      <h1 className="font-bold text-black-600 text-2xl">Admin</h1>
      <p className="mt-4 text-gray-700">
        Welcome, <span className="font-semibold">{user}</span>. Here's a list of all requests raised against your team.
      </p>

      {/* CARDS CARDS */}{/* CARDS CARDS */}{/* CARDS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {/* Total Projects */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Tickets</h3>
              <p className="text-3xl font-bold mt-2">{reports.length}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-center text-sm opacity-90">
            <span className="mr-2">📈</span>
            <span>Increased from last month</span>
          </div>
        </div>

        {/* Ended Projects (Resolved or Closed) */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-10 translate-x-10 group-hover:bg-blue-100 transition-colors duration-300"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-200">Ended Tickets</h3>
              <p className="text-3xl font-bold mt-2 text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                {
                  reports.filter(r =>
                    r.ticketStatus?.toLowerCase() === 'resolved' ||
                    r.ticketStatus?.toLowerCase() === 'closed'
                  ).length
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
            <span className="mr-2">✅</span>
            <span>Completed successfully</span>
          </div>
        </div>




      </div>

      {/* END OF CARD */}{/* END OF CARD */}{/* END OF CARD */}

      <div className="mt-8">
        <div className="pb-[10px] flex justify-between items-center">
          <h2 className="font-bold text-[20px]">Ticketing</h2>

          <div className="flex items-center justify-center p-8">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by ID, title, description, priority, department, requester, team, status..."
                className="w-full h-10 pl-12 pr-12 text-sm border border-black rounded-full bg-white 
                     focus:outline-none focus:border-black
                     placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 w-4 h-4 flex items-center justify-center"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search results info */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {filteredTickets.length === 0 && (
              <span className="ml-2 text-orange-600">- Try a different search term</span>
            )}
          </div>
        )}



        <div className="shadow-lg border rounded-lg overflow-x-auto max-w-[1200px] bg-white">
          <table className="bg-white min-w-full table-fixed">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 font-semibold text-gray-700 text-sm text-left">
              <tr>
                <th className="px-4 py-4 border-b-2 border-gray-300">Ticket ID</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Title</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Description</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Priority</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Requester Dept</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Requester</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Responsible Team</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Status</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Logged Time</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Closed By</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Comment</th>
                <th className="px-4 py-4 border-b-2 border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((report, index) => (
                <tr key={report.id} className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200">
                  <td className="px-4 py-4 break-words whitespace-normal font-medium text-gray-600">
                    {report.id}
                  </td>

                  <td className="px-4 py-4 break-words whitespace-normal font-medium text-gray-900">{report.title}</td>
                  <td className="px-4 py-4 break-words whitespace-normal text-gray-700">{report.ticketDescription}</td>
                  <td className="px-4 py-4 break-words whitespace-normal">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.ticketPriority?.toLowerCase() === 'high' || report.ticketPriority?.toLowerCase() === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : report.ticketPriority?.toLowerCase() === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                      }`}>
                      {report.ticketPriority}
                    </span>
                  </td>
                  <td className="px-4 py-4 break-words whitespace-normal text-gray-700">{report.requesterDept}</td>
                  <td className="px-4 py-4 break-words whitespace-normal text-gray-700">{report.requesterName}</td>
                  <td className="px-4 py-4 break-words whitespace-normal text-gray-700">
                    {
                      report.responsibleTeam
                    }
                  </td>
                  <td className="px-4 py-4 break-words whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${report.ticketStatus?.toLowerCase() === 'open' || report.ticketStatus?.toLowerCase() === 'new'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : report.ticketStatus?.toLowerCase() === 'in progress' || report.ticketStatus?.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : report.ticketStatus?.toLowerCase() === 'resolved' || report.ticketStatus?.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : report.ticketStatus?.toLowerCase() === 'closed'
                              ? 'bg-gray-100 text-gray-800 border border-gray-200'
                              : report.ticketStatus?.toLowerCase() === 'rejected' || report.ticketStatus?.toLowerCase() === 'cancelled'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                    >
                      {report.ticketStatus?.replace(/ /g, '\u00A0')}
                    </span>
                  </td>

                  <td className="px-4 py-4 break-words whitespace-normal text-gray-600 font-mono text-xs">
                    {report.loggedTime ? new Date(report.loggedTime).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-4 py-4 break-words whitespace-normal">
                    {report.closedBy
                      ? (
                        <span className="text-gray-700 font-medium">
                          {report.closedBy
                            .split('.')
                            .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
                            .join(' ')
                          }
                        </span>
                      )
                      : <span className="italic text-gray-400">Not specified</span>}
                  </td>

                  <td className="px-4 py-4 break-words whitespace-normal">
                    {report.comment
                      ? <span className="text-gray-700">{report.comment}</span>
                      : <span className="italic text-gray-400">No comment</span>}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => {
                        setSelectedTicket(report);
                        setIsModalOpen(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
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
            <div className="bg-white/95 backdrop-blur-md w-full max-w-lg max-h-[70vh] rounded-xl shadow-2xl border border-white/20 relative mx-4 overflow-hidden flex flex-col">
              <button
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors duration-200 z-10"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800 pr-8">Update Ticket</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
                    <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-[#dedede]">{selectedTicket.id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-[#dedede]">{selectedTicket.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-[#dedede] min-h-[60px]">{selectedTicket.ticketDescription}</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedTicket.ticketPriority}
                      </span>
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Ticket Status</label>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedTicket.ticketStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name</label>
                      <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-[#dedede]">{selectedTicket.requesterName}</p>
                    </div>

                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requester Dept</label>
                      <p className="text-gray-800 bg-gray-50 rounded-md px-3 py-2 border border-[#dedede]">{selectedTicket.requesterDept}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <label
                        htmlFor="ticketStatus"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>

                      <select
                        id="ticketStatus"
                        value={update.ticketStatus}
                        onChange={(e) => {
                          const status = e.target.value;
                          setUpdate({
                            ...update,
                            ticketStatus: status,
                            closureComment: status === "Resolved"
                              ? "Awaiting requester's approval"
                              : update.closureComment,
                          });
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      >
                        <option value="">Select status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>


                    <div className="w-1/2">
                      <ReassignDropdown
                        value={update.assignedTo || ""}
                        onChange={(e) => {
                          setUpdate({
                            ...update,
                            assignedTo: e.target.value,
                          });
                        }}
                      />
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                    <a
                      href={selectedTicket.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Attachment
                    </a>
                  </div>

                </div>
              </div>

              <div className="p-6 pt-4 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(selectedTicket)}
                  disabled={selectedTicket.ticketStatus === "Resolved" || selectedTicket.ticketStatus === "Closed"}
                  className={`px-4 py-2 rounded text-white ${selectedTicket.ticketStatus === "Resolved" || selectedTicket.ticketStatus === "Closed"
                    ? 'bg-green-600 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                >
                  {selectedTicket.ticketStatus === "Resolved" || selectedTicket.ticketStatus === "Closed"
                    ? "Resolved"
                    : "Confirm Update"}
                </button>

              </div>
            </div>
          </div>
        )}



      </div>



      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full animate-fadeIn">
            <h2 className="text-orange-500 text-2xl font-bold mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">Ticket has been successfully updated.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;