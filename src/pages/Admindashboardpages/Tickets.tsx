// src/components/Tickets.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/Dashboardlayouts";
import axios from "axios";

interface Props {
  id: string;
  title: string;
  ticketDescription: string;
  ticketPriority: string;
  ticketStatus: string;
  ticketSlaStatus: string;
  loggedTime: string;
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

const Tickets: React.FC = () => {
  const [reports, setReports] = useState<Props[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  useEffect(() => {
    const fetchTickets = async () => {
      const basicAuth = "Basic " + btoa("Alphadeskuser:Qwerty1234");
      try {
        const { data } = await axios.get<Props[]>(
          "https://reportpool.alphamorganbank.com:8443/api/tickets",
          { headers: { Authorization: basicAuth } }
        );

        const enriched = data.map(ticket => ({
          ...ticket,
          updatedStatus: ticket.ticketStatus || "Pending",
          comment: ticket.closureComment || ""
        }));
        setReports(enriched);
      } catch (err) {
        console.error("Failed fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const start = (currentPage - 1) * reportsPerPage;
  const visible = reports.slice(start, start + reportsPerPage);

  const handleInputChange = (
    idx: number,
    field: "comment" | "updatedStatus",
    value: string
  ) => {
    const clone = [...reports];
    clone[idx][field] = value;
    setReports(clone);
  };

  const handleUpdate = async (idx: number) => {
    const r = reports[idx];
    const basicAuth = "Basic " + btoa("Alphadeskuser:Qwerty1234");
    try {
      await axios.put(
        `https://reportpool.alphamorganbank.com:8443/api/tickets/${r.id}`,
        { status: r.updatedStatus, comment: r.comment },
        { headers: { Authorization: basicAuth } }
      );
      alert("Update successful!");
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">Ticketing</h2>

        <div className="shadow border rounded-lg overflow-x-auto max-w-[1200px]">
          <table className="bg-white min-w-full table-fixed text-sm text-left">
            <thead className="bg-gray-100 font-semibold text-gray-600">
              <tr>
                {["S/N", "Title", "Description", "Priority", "Requester Dept",
                  "Requester", "Team", "Responsible", "Status", "Logged Time",
                  "Comment", "Update Status", "Action"].map(th => (
                  <th key={th} className="px-4 py-3">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {visible.map((rep, i) => {
                const idx = start + i;
                return (
                  <tr key={rep.id} className="even:bg-gray-50 border-t">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 break-words">{rep.title}</td>
                    <td className="px-4 py-3 break-words">{rep.ticketDescription}</td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{rep.ticketPriority}</td>
                    <td className="px-4 py-3">{rep.requesterDept}</td>
                    <td className="px-4 py-3">{rep.requesterName}</td>
                    <td className="px-4 py-3">{rep.responsibleTeam}</td>
                    <td className="px-4 py-3">{rep.responsibleName}</td>
                    <td className="px-4 py-3">{rep.ticketStatus}</td>
                    <td className="px-4 py-3">{rep.loggedTime ? new Date(rep.loggedTime).toLocaleString() : "N/A"}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Enter comment"
                        value={rep.comment}
                        onChange={e => handleInputChange(idx, "comment", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={rep.updatedStatus}
                        onChange={e => handleInputChange(idx, "updatedStatus", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      >
                        {["Pending", "In Progress", "Resolved", "Closed"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUpdate(idx)}
                        className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded text-white"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-orange-500 text-white" : ""}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;
