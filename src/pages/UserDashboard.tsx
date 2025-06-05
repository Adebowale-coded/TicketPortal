import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/Dashboardlayouts';
import InputField from "../components/Inputfield";
import TextAreaField from "../components/Textarea";
import SelectField from "../components/Selectfield";

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
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<string[]>([])

  const [reportData, setReportData] = useState({
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
      Object.keys(reportData).forEach(key => {
        const value = (reportData as any)[key]
        formData.append(key, value);
      })
 
      files.forEach((file) => {
        formData.append('attachment', file);
        console.log(file)
      });
 
      //@ts-ignore
      for (const file of formData) {
        console.log(file);
      }
 
      console.log(Object.keys(reportData))
    const url = 'https://reportpool.alphamorganbank.com:8443/api/tickets'; // Replace with actual URL
    const username = 'alphadeskuser';
    const password = 'Qwerty1234';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': basicAuth,
          'Content-type':'Application/JSON'
        },
        body: JSON.stringify({
          "title": "Printer Issue",
        "ticketDescription": "Printer not working on floor 3",
        "ticketPriority": "High",
        "requesterDept": "Finance",
        "requesterName": "Alice Tan",
        "responsibleName": "David Lee",
        "responsibleDept": "IT Support",
        "responsibleTeam": "Channels",
        "ticketStatus": "Closed",
        "ticketSlaStatus": "On Time",
        "attachment": "specs.pdf",
        "loggedTime": "2024-11-01T09:10:00",
        "closedBy": "John Smith",
        "closureComment": null,
        "closureTime": "2024-11-01T14:35:22"
        }),
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
    setReportData({
      ...reportData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.currentTarget.files;
  if (files) {
    const fileNames = Array.from(files).map(file => file.name);
    console.log("Selected file names:", fileNames);
    setFiles(fileNames); // assuming setFiles accepts string[]
  }
};

  const handleDelete = (id: any) => {

  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div>
        <h1 className='font-semibold font-[poppins]'>Hello, User</h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg">
          <h3 className="text-sm text-gray-500 uppercase font-semibold mb-2">Pending Reports</h3>
          <p className="text-3xl font-bold text-orange-500">
            {incidents.filter(i => i.status === 'Open' || i.ticketStatus === 'Open').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg">
          <h3 className="text-sm text-gray-500 uppercase font-semibold mb-2">Resolved Cases</h3>
          <p className="text-3xl font-bold text-green-500">
            {incidents.filter(i => i.status === 'Closed' || i.ticketStatus === 'Closed').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg">
          <h3 className="text-sm text-gray-500 uppercase font-semibold mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-500">
            {incidents.filter(i => i.status === 'In Progress' || i.ticketStatus === 'In Progress').length}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-full mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Incident</h2>

        {/* Incident Info */}
        <InputField
          label="Incident Title *"
          name="title"
          value={reportData.title}
          onChange={handleChange}
          placeholder="e.g. Printer not working"

        />

        <TextAreaField
          label="Description *"
          name="ticketDescription"
          value={reportData.ticketDescription}
          onChange={handleChange}
          placeholder="e.g. Printer not working on floor 3"

        />

        <SelectField
          label="Priority *"
          name="ticketPriority"
          value={reportData.ticketPriority}
          onChange={handleChange}
          options={['Low', 'Medium', 'High']}

        />

        {/* Requester Info */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Name *"
              name="requesterName"
              value={reportData.requesterName}
              onChange={handleChange}

            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Department *"
              name="requesterDept"
              value={reportData.requesterDept}
              onChange={handleChange}

            />
          </div>
        </div>

        {/* Responsible Info */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <InputField
              label="Responsible Person"
              name="responsibleName"
              value={reportData.responsibleName}
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Responsible Department"
              name="responsibleDept"
              value={reportData.responsibleDept}
              onChange={handleChange}
            />
          </div>
        </div>

        <SelectField
          label="Responsible Team"
          name="responsibleTeam"
          value={reportData.responsibleTeam}
          onChange={handleChange}
          options={['Channels', 'Support', 'Network']}
        />

        {/* Closure Comment */}
        <TextAreaField
          label="Additional Comments"
          name="closureComment"
          value={reportData.closureComment}
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
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
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
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>

      {/* Incident List */}
      <div className="mt-12 max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submitted Incidents</h2>

        {incidents.length === 0 ? (
          <p className="text-gray-500 italic">
            {reportData.requesterName ? 'No incidents found for this requester.' : 'Enter requester name to view incidents.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-t hover:bg-gray-50">
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
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 transition"
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
    </DashboardLayout>
  );
};

export default UserDashboard;