import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/Dashboardlayouts';
import InputField from "../components/Inputfield";
import TextAreaField from "../components/Textarea";
import SelectField from "../components/Selectfield";
import { Outlet } from 'react-router-dom';

interface Incident {
  id: string;
  incidentTitle: string;
  incidentDate: string;
  status: string;
  title?: string;
  loggedTime?: string;
  ticketStatus?: string;
}

const UserDashboard = () => {
  const [tickets, settickets] = useState<Incident[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([])

  const [ticketData, setTicketData] = useState({
    title: '',
    ticketDescription: '',
    ticketPriority: '',
    requesterDept: '',
    requesterName: '',
    responsibleName: '',
    responsibleDept: 'IT',
    responsibleTeam: '',
    ticketStatus: '',
    ticketSlaStatus: '',
    loggedTime: '',
    closedBy: '',
    closureComment: '',
    closureTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ticket', JSON.stringify(ticketData));

    files.forEach((file) => {
      formData.append('attachment', file);
      console.log(file)
    });

    //@ts-ignore
    for (const file of formData) {
      console.log(file);
    }

    console.log(Object.keys(ticketData))
    const url = 'https://reportpool.alphamorganbank.com:8443/api/tickets'; // Replace with actual URL
    const username = 'sammyuser';
    const password = 'Alpha1234$';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': basicAuth,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response;
      alert("Successfully")
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const fileArray = Array.from(files);
      setFiles(fileArray);
    }
  };

  const handleDelete = (id: any) => {

  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div>
        <h1 className='font-[poppins] font-semibold'>Hello, User</h1>
      </div>

      {/* Status Cards */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8">
        <div className="bg-white shadow-md hover:shadow-lg p-6 border border-gray-100 rounded-lg">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm uppercase">Pending Reports</h3>
          <p className="font-bold text-orange-500 text-3xl">
            {tickets.filter(i => i.status === 'Open' || i.ticketStatus === 'Open').length}
          </p>
        </div>

        <div className="bg-white shadow-md hover:shadow-lg p-6 border border-gray-100 rounded-lg">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm uppercase">Resolved Cases</h3>
          <p className="font-bold text-green-500 text-3xl">
            {tickets.filter(i => i.status === 'Closed' || i.ticketStatus === 'Closed').length}
          </p>
        </div>

        <div className="bg-white shadow-md hover:shadow-lg p-6 border border-gray-100 rounded-lg">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm uppercase">In Progress</h3>
          <p className="font-bold text-blue-500 text-3xl">
            {tickets.filter(i => i.status === 'In Progress' || i.ticketStatus === 'In Progress').length}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md mx-auto mt-8 p-8 rounded-lg w-full max-w-full"
      >
        <h2 className="mb-6 font-bold text-gray-800 text-2xl">Raise Ticket</h2>

        {/* Incident Info */}
        <InputField
          label="Ticket Title *"
          name="title"
          value={ticketData.title}
          onChange={handleChange}
          placeholder="e.g. Printer not working"

        />

        <TextAreaField
          label="Description *"
          name="ticketDescription"
          value={ticketData.ticketDescription}
          onChange={handleChange}
          placeholder="e.g. Printer not working on floor 3"

        />

        <SelectField
          label="Priority *"
          name="ticketPriority"
          value={ticketData.ticketPriority}
          onChange={handleChange}
          options={['Low', 'Medium', 'High']}

        />

        {/* Requester Info */}
        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Name *"
              name="requesterName"
              value={ticketData.requesterName}
              onChange={handleChange}

            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Department *"
              name="requesterDept"
              value={ticketData.requesterDept}
              onChange={handleChange}

            />
          </div>
        </div>

        {/* Responsible Info */}
        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full md:w-1/2">
            <InputField
              label="Responsible Person"
              name="responsibleName"
              value={ticketData.responsibleName}
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Responsible Department"
              name="responsibleDept"
              value={ticketData.responsibleDept}
              onChange={handleChange}
            />
          </div>
        </div>

        <SelectField
          label="Responsible Team"
          name="responsibleTeam"
          value={ticketData.responsibleTeam}
          onChange={handleChange}
          options={['Channels', 'Support', 'Network']}
        />

        {/* Closure Comment */}
        <TextAreaField
          label="Additional Comments"
          name="closureComment"
          value={ticketData.closureComment}
          onChange={handleChange}
          placeholder="Optional additional information..."
        />

        {/* File Upload */}
        <div className="mb-4">
          <label
            htmlFor="attachment"
            className="block mb-2 font-medium text-gray-700"
          >
            Attachment
          </label>
          <input
            type="file"
            name="attachment"
            id="attachment"
            onChange={handleFileChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <p className="mt-1 text-gray-500 text-sm">
            Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md transition duration-300 font-medium ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600'
            } text-white`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Incident List */}
      <div className="bg-white shadow-md mx-auto mt-12 p-6 rounded-lg max-w-full">
        <h2 className="mb-4 font-bold text-gray-800 text-2xl">Submitted tickets</h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500 italic">
            {ticketData.requesterName ? 'No tickets found for this requester.' : 'Enter requester name to view tickets.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-700 text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-3">
                      {incident.incidentTitle || incident.title || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {incident.incidentDate ||
                        (incident.loggedTime ? new Date(incident.loggedTime).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${(incident.status === 'Closed' || incident.ticketStatus === 'Closed')
                        ? 'text-green-600 bg-green-100'
                        : (incident.status === 'In Progress' || incident.ticketStatus === 'In Progress')
                          ? 'text-blue-600 bg-blue-100'
                          : 'text-orange-600 bg-orange-100'
                        }`}>
                        {incident.status || incident.ticketStatus || 'Open'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Outlet />
    </DashboardLayout>
  );
};

export default UserDashboard;