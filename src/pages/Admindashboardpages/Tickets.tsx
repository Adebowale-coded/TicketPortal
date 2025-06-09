import DashboardLayout from '../../layouts/Dashboardlayouts';

const Tickets = () => {
  // Sample data — you can later replace this with API call or props
  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Unable to login to account',
      status: 'Open',
      createdAt: '2025-06-01',
      assignedTo: 'John Admin',
    },
    {
      id: 'TKT-002',
      subject: 'Error while uploading document',
      status: 'In Progress',
      createdAt: '2025-06-05',
      assignedTo: 'Grace Support',
    },
    {
      id: 'TKT-003',
      subject: 'Profile update not saving',
      status: 'Resolved',
      createdAt: '2025-06-07',
      assignedTo: 'N/A',
    },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white shadow-sm mx-auto mt-6 p-6 border border-gray-200 rounded-md max-w-full">
        <h2 className="mb-6 font-semibold text-xl">Tickets Overview</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-gray-600">Ticket ID</th>
                <th className="px-4 py-3 text-gray-600">Subject</th>
                <th className="px-4 py-3 text-gray-600">Status</th>
                <th className="px-4 py-3 text-gray-600">Date Created</th>
                <th className="px-4 py-3 text-gray-600">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-3 font-medium text-gray-800">{ticket.id}</td>
                  <td className="px-4 py-3">{ticket.subject}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'Open'
                          ? 'bg-yellow-100 text-yellow-700'
                          : ticket.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{ticket.createdAt}</td>
                  <td className="px-4 py-3">{ticket.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className="py-10 text-gray-500 text-sm text-center">
              No tickets raised yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;
