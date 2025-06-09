import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/Dashboardlayouts';
import InputField from "../components/Inputfield";
import TextAreaField from "../components/Textarea";
import SelectField from "../components/Selectfield";
import profile from "../pages/userdashboardpages/Profile"


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

  const BasicAuth = { username: "alphadeskuser", password: "Qwerty1234" };
  // Authentication helper function - tries multiple common token storage locations
  const getAuthToken = (): string | null => {
    // Try common token storage locations
    const tokenSources = [
      () => localStorage.getItem('authToken'),
      () => localStorage.getItem('token'),
      () => localStorage.getItem('accessToken'),
      () => localStorage.getItem('jwt'),
      () => sessionStorage.getItem('authToken'),
      () => sessionStorage.getItem('token'),
      () => sessionStorage.getItem('accessToken'),
      () => sessionStorage.getItem('jwt'),
      () => {
        // Try to get from cookies
        const cookieMatch = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken=') || row.startsWith('token='));
        return cookieMatch ? cookieMatch.split('=')[1] : null;
      }
    ];

    for (const getToken of tokenSources) {
      try {
        const token = getToken();
        if (token && token.trim()) {
          console.log('Found auth token from storage');
          return token.trim();
        }
      } catch (error) {
        console.warn('Error accessing token storage:', error);
      }
    }

    console.warn('No auth token found in common storage locations');
    return null;
  };

  const [formData, setFormData] = useState({
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
    attachment: null as File | null,
    loggedTime: '',
    closedBy: '',
    closureComment: '',
    closureTime: '',
  });

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      attachment: e.target.files?.[0] || null,
    });
  };

  const resetForm = () => {
    setFormData({
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
      attachment: null,
      loggedTime: '',
      closedBy: '',
      closureComment: '',
      closureTime: '',
    });

    // Reset file input
    const fileInput = document.getElementById('attachment') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate  fields
    const Fields = ['title', 'ticketDescription', 'ticketPriority', 'requesterName', 'requesterDept'];
    const missingFields = Fields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in  fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    const authToken = getAuthToken();
    try {
      // Get authentication token

      // Create FormData for file upload support
      const formDataToSend = new FormData();

      // Prepare payload without file
      const { attachment, ...payloadData } = formData;
      const payload = {
        ...payloadData,
        ticketStatus: 'Open',
        ticketSlaStatus: 'Pending',
        loggedTime: new Date().toISOString(),
      };

      // Add JSON data
      formDataToSend.append('data', JSON.stringify(payload));

      // Add file if it exists
      if (attachment) {
        formDataToSend.append('attachment', attachment);
      }

      // Prepare headers
      const headers: HeadersInit = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;

      }
      const basicAuth = 'Basic ' + btoa(`${BasicAuth.username}:${BasicAuth.password}`);
      const response = await fetch('https://reportpool.alphamorganbank.com:8443/api/tickets', {
        method: 'POST',
        headers: {
          'Authorization': basicAuth,
        },
        body: {
          'title': '',
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
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to submit ticket'}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('Incident Report Submitted Successfully!');

      resetForm();

      // Refresh incidents list if requester name is available
      if (formData.requesterName) {
        fetchTickets();
      }

    } catch (error) {
      console.error('Error submitting the ticket:', error);

      // Try JSON-only approach as fallback
      try {
        console.log('Trying JSON-only approach...');
        const { attachment, ...payloadData } = formData;
        const payload = {
          ...payloadData,
          ticketStatus: 'Open',
          ticketSlaStatus: 'Pending',
          loggedTime: new Date().toISOString(),
        };

        // Prepare headers for JSON request
        const jsonHeaders: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (authToken) {
          jsonHeaders['Authorization'] = `Bearer ${authToken}`;
        }

        const jsonResponse = await fetch('https://reportpool.alphamorganbank.com:8443/api/tickets', {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(payload),
        });

        if (!jsonResponse.ok) {
          const errorText = await jsonResponse.text();
          throw new Error(`HTTP ${jsonResponse.status}: ${errorText}`);
        }

        const jsonData = await jsonResponse.json();
        console.log('JSON Success:', jsonData);
        alert('Incident Report Submitted Successfully! (Note: File attachment was not uploaded)');
        resetForm();

        if (formData.requesterName) {
          fetchTickets();
        }

      } catch (jsonError) {
        console.error('JSON fallback also failed:', jsonError);
        alert(`Failed to submit ticket: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTickets = async () => {
    if (!formData.requesterName.trim()) return;

    try {
      const authToken = getAuthToken();

      // Prepare headers
      const headers: HeadersInit = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `https://reportpool.alphamorganbank.com:8443/api/tickets/getByReqName?requesterName=${encodeURIComponent(formData.requesterName)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch tickets`);
      }

      const data = await response.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Don't show alert for fetch errors, just log them
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this incident?')) {
      return;
    }

    try {
      // If you have a delete API endpoint, use it
      // const response = await fetch(`https://reportpool.alphamorganbank.com:8443/api/tickets/${id}`, {
      //   method: 'DELETE',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to delete ticket');
      // }

      // For now, just remove from local state
      const updatedIncidents = incidents.filter((incident) => incident.id !== id);
      setIncidents(updatedIncidents);
      alert('Incident deleted successfully!');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete incident. Please try again.');
    }
  };

  useEffect(() => {
    if (formData.requesterName.trim()) {
      const timeoutId = setTimeout(() => {
        fetchTickets();
      }, 500); // Debounce API calls

      return () => clearTimeout(timeoutId);
    } else {
      setIncidents([]);
    }
  }, [formData.requesterName]);

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
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Printer not working"

        />

        <TextAreaField
          label="Description *"
          name="ticketDescription"
          value={formData.ticketDescription}
          onChange={handleChange}
          placeholder="e.g. Printer not working on floor 3"

        />

        <SelectField
          label="Priority *"
          name="ticketPriority"
          value={formData.ticketPriority}
          onChange={handleChange}
          options={['Low', 'Medium', 'High']}

        />

        {/* Requester Info */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Name *"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}

            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Requester Department *"
              name="requesterDept"
              value={formData.requesterDept}
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
              value={formData.responsibleName}
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2">
            <InputField
              label="Responsible Department"
              name="responsibleDept"
              value={formData.responsibleDept}
              onChange={handleChange}
            />
          </div>
        </div>

        <SelectField
          label="Responsible Team"
          name="responsibleTeam"
          value={formData.responsibleTeam}
          onChange={handleChange}
          options={['Channels', 'Support', 'Network']}
        />

        {/* Closure Comment */}
        <TextAreaField
          label="Additional Comments"
          name="closureComment"
          value={formData.closureComment}
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
            {formData.requesterName ? 'No incidents found for this requester.' : 'Enter requester name to view incidents.'}
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