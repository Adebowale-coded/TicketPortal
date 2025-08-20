import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/Dashboardlayouts';
import InputField from "../components/Inputfield";
import TextAreaField from "../components/Textarea";
import SelectField from "../components/Selectfield";
import { Outlet } from 'react-router-dom';
import ticketOptions from '../components/TicketOptions';
import axios from "axios";

interface Incident {
  id: string;
  incidentTitle: string;
  incidentDate: string;
  status: string;
  title?: string;
  loggedTime?: string;
  ticketStatus?: string;
  ticketDescription?: string;
  ticketPriority?: string;
  requesterName?: string;
  requesterDept?: string;
  responsibleName?: string;
  responsibleDept?: string;
  responsibleTeam?: string;
  ticketSlaStatus?: string;
  closedBy?: string;
  closureComment?: string;
  closureTime?: string;
}

const UserDashboard = () => {
  const [tickets, settickets] = useState<Incident[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([])
  const rawUser = localStorage.getItem('username') || '';
  const user = rawUser
    .split('.')
    .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
    .join(' ');
  const userDept = localStorage.getItem('dept')

  const [ticketData, setTicketData] = useState({
    title: '',
    ticketDescription: '',
    ticketPriority: '',
    requesterDept: userDept ?? '',
    requesterName: rawUser ?? '',
    responsibleName: '',
    responsibleDept: 'IT',
    responsibleTeam: '',
    ticketStatus: 'Open',
    ticketSlaStatus: '',
    loggedTime: getLocalISOString(),
    closedBy: '',
    closureComment: '',
    closureTime: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Incident | null>(null);

  // Reset form when modal opens
  const resetForm = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedIssue('');
    setFiles([]);
    setTicketData({
      title: '',
      ticketDescription: '',
      ticketPriority: '',
      requesterDept: userDept ?? '',
      requesterName: rawUser ?? '',
      responsibleName: '',
      responsibleDept: 'IT',
      responsibleTeam: '',
      ticketStatus: 'Open',
      ticketSlaStatus: '',
      loggedTime: new Date().toISOString().slice(0, 19),
      closedBy: '',
      closureComment: '',
      closureTime: '',
    });
  };

  // Function to handle view button click
  const handleViewTicket = (ticket: Incident) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  // Function to close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTicket(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const formData = new FormData();

    const updatedTicketData = {
      ...ticketData,
      title: `${selectedCategory} - ${selectedSubcategory}`,
    };

    formData.append('ticket', JSON.stringify(updatedTicketData));

    files.forEach((file) => {
      formData.append('attachment', file);
      console.log(file)
    });

    //@ts-ignore
    for (const file of formData) {
      console.log(file);
    }

    console.log(Object.keys(ticketData))
    const url = 'https://reportpool.alphamorganbank.com:8443/api/tickets';
    const username = 'AlphadeskTestuser';
    const password = 'Qwerty1234';
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
      setIsModalOpen(false); // Close the modal first
      setShowSuccessModal(true);
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
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

  useEffect(() => {
    const fetchTickets = async () => {
      if (!ticketData.requesterName) return;

      const username = 'AlphadeskTestuser';
      const password = 'Qwerty1234';
      const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

      try {
        const response = await axios.get(
          'https://reportpool.alphamorganbank.com:8443/api/tickets',
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        );

        const allTickets = response.data as Incident[];
        const now = new Date();

        const autoCloseRequests = allTickets.map(async (ticket) => {
          const loggedTime = new Date(ticket.loggedTime || ticket.incidentDate);
          const isOlderThan24Hours =
            now.getTime() - loggedTime.getTime() > 24 * 60 * 60 * 1000;

          const isOpen = ticket.status === 'Open' || ticket.ticketStatus === 'Open';

          if (isOlderThan24Hours && isOpen) {
            try {
              await axios.patch(
                `https://reportpool.alphamorganbank.com:8443/api/tickets/${ticket.id}`,
                {
                  ticketStatus: 'Closed',
                  closureTime: new Date().toISOString(),
                  closureComment: 'Automatically closed after 24 hours without approval.',
                },
                {
                  headers: {
                    Authorization: basicAuth,
                    'Content-Type': 'application/json',
                  },
                }
              );
            } catch (err) {
              console.error(`Auto-close failed for ticket ${ticket.id}`, err);
            }
          }
        });

        await Promise.all(autoCloseRequests);

        const userTickets = allTickets.filter(
          (ticket) =>
            (ticket as any).requesterName?.toLowerCase() ===
            ticketData.requesterName.toLowerCase()
        );

        settickets(userTickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 15000);
    return () => clearInterval(interval);
  }, [ticketData.requesterName]);


  const categoryOptions = ticketOptions.map(option => option.category);

  const subcategoryOptions = selectedCategory
    ? ticketOptions.find(option => option.category === selectedCategory)?.subcategories.map(sub => sub.name) || []
    : [];

  // const issueOptions = selectedSubcategory
  //   ? ticketOptions
  //     .find(option => option.category === selectedCategory)
  //     ?.subcategories.find(sub => sub.name === selectedSubcategory)?.issues || []
  //   : [];

  // const selectedDept = ticketOptions
  //   .find(option => option.category === selectedCategory)
  //   ?.subcategories.find(sub => sub.name === selectedSubcategory)?.department || '';

  const isFormValid = selectedCategory && selectedSubcategory && ticketData.ticketDescription && ticketData.ticketPriority;


  function getLocalISOString() {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // Months are zero-based
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }




  return (
    <DashboardLayout>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='font-[poppins] font-semibold'>Hello, {user}</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Create New Ticket
        </button>
      </div>

      {/* Status Cards */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8">
        <div className="bg-white shadow-md hover:shadow-lg p-6 border border-gray-100 rounded-lg">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm uppercase">Pending Reports</h3>
          <p className="font-bold text-orange-500 text-3xl">
            {tickets.filter(i => i.status === 'Open' || i.ticketStatus === 'Open' || i.ticketStatus === '').length}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Raise Ticket</h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"   // ✅ Accessible name
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"       // ✅ Screen readers will ignore the SVG
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>


            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Incident Info */}
                <SelectField
                  label="Category *"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                    setSelectedIssue('');
                  }}
                  options={categoryOptions}
                />

                {selectedCategory && (
                  <SelectField
                    label="Subcategory *"
                    name="subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => {
                      const sub = e.target.value;
                      setSelectedSubcategory(sub);

                      // Get department for this subcategory
                      const matchedSub = ticketOptions
                        .find(option => option.category === selectedCategory)
                        ?.subcategories.find(subcat => subcat.name === sub);

                      setTicketData(prev => ({
                        ...prev,
                        responsibleTeam: matchedSub?.department || '',
                        responsibleName: '',
                      }));
                    }}
                    options={subcategoryOptions}
                  />
                )}

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
                      value={user}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <InputField
                      label="Requester Department"
                      name="requesterDept"
                      value={ticketData.requesterDept}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>

                {/* Responsible Info */}
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="w-full md:w-1/2">
                    <InputField
                      label="Responsible Team"
                      name="responsibleTeam"
                      value={ticketData.responsibleTeam}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <InputField
                      label="Responsible Department"
                      name="responsibleDept"
                      value={ticketData.responsibleDept}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>

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

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`px-6 py-2 rounded-md transition duration-300 font-medium ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600'
                      } text-white`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-[#0000003f] backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>
                <p className="text-sm text-gray-600 mt-1">Ticket ID: {selectedTicket.id}</p>
              </div>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${(selectedTicket.status === 'Closed' || selectedTicket.ticketStatus === 'Closed')
                    ? 'text-green-800 bg-green-100 border border-green-200'
                    : (selectedTicket.status === 'In Progress' || selectedTicket.ticketStatus === 'In Progress')
                      ? 'text-blue-800 bg-blue-100 border border-blue-200'
                      : 'text-orange-800 bg-orange-100 border border-orange-200'
                    }`}>
                    {selectedTicket.status || selectedTicket.ticketStatus || 'Open'}
                  </span>
                  {selectedTicket.ticketPriority && (
                    <span className={`px-3 py-1 text-xs font-medium rounded-md ${selectedTicket.ticketPriority === 'High'
                      ? 'text-red-800 bg-red-100'
                      : selectedTicket.ticketPriority === 'Medium'
                        ? 'text-yellow-800 bg-yellow-100'
                        : 'text-gray-800 bg-gray-100'
                      }`}>
                      {selectedTicket.ticketPriority} Priority
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Logged: {selectedTicket.incidentDate ||
                    (selectedTicket.loggedTime ? new Date(selectedTicket.loggedTime).toLocaleString() : 'N/A')}
                </div>
              </div>

              {/* Ticket Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.incidentTitle || selectedTicket.title || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md min-h-[80px]">
                      {selectedTicket.ticketDescription || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.ticketPriority || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Assignment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Assignment Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Requester</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.requesterName || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Requester Department</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.requesterDept || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Responsible Team</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.responsibleTeam || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Responsible Department</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.responsibleDept || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Created Date</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.incidentDate ||
                        (selectedTicket.loggedTime ? new Date(selectedTicket.loggedTime).toLocaleString() : 'N/A')}
                    </p>
                  </div>

                  {selectedTicket.closureTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Closed Date</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                        {new Date(selectedTicket.closureTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {selectedTicket.closureComment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Closure Comment</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.closureComment}
                    </p>
                  </div>
                )}

                {selectedTicket.closedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Closed By</label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedTicket.closedBy}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeViewModal}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-white transition duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident List */}
      <div className="bg-white shadow-md mx-auto mt-12 p-6 rounded-lg max-w-full">
        <h2 className="mb-4 font-bold text-gray-800 text-2xl">Submitted tickets</h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500 italic">
            {ticketData.requesterName ? 'No tickets found for this requester.' : 'Enter requester name to view tickets.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-800">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reopen</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">View</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="px-6 py-4 text-sm font-medium">
                      {incident.incidentTitle || incident.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incident.incidentDate ||
                        (incident.loggedTime ? new Date(incident.loggedTime).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-md ${(incident.status === 'Closed' || incident.ticketStatus === 'Closed')
                        ? 'text-green-800 bg-green-100'
                        : (incident.status === 'In Progress' || incident.ticketStatus === 'In Progress')
                          ? 'text-blue-800 bg-blue-100'
                          : 'text-orange-800 bg-orange-100'
                        }`}>
                        {incident.status || incident.ticketStatus || 'Open'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(incident.ticketStatus === 'Resolved' || incident.status === 'Resolved') ? (
                        // Replace your reopen button onClick handler with this:
                        <button
                          className="px-4 py-2 text-sm font-medium rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors"
                          onClick={async () => {
                            const username = 'AlphadeskTestuser';
                            const password = 'Qwerty1234';
                            const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

                            try {
                              await axios.put(
                                `https://reportpool.alphamorganbank.com:8443/api/tickets`,
                                {
                                  id: incident.id,
                                  title: incident.title ?? null,
                                  ticketDescription: incident.ticketDescription ?? null,
                                  ticketPriority: incident.ticketPriority ?? null,
                                  requesterDept: incident.requesterDept ?? null,
                                  requesterName: incident.requesterName ?? null,
                                  responsibleName: incident.responsibleName ?? null,
                                  responsibleDept: incident.responsibleDept ?? null,
                                  responsibleTeam: incident.responsibleTeam ?? null,
                                  ticketStatus: 'Open', // only this is changed
                                  ticketSlaStatus: incident.ticketSlaStatus ?? null,
                                  attachment: null,
                                  loggedTime: incident.loggedTime ?? null,
                                  closedBy: incident.closedBy,
                                  closureComment: null,
                                  closureTime: null
                                },
                                {
                                  headers: {
                                    Authorization: basicAuth,
                                    'Content-Type': 'application/json',
                                  },
                                }
                              );

                              settickets(prevTickets =>
                                prevTickets.map(ticket =>
                                  ticket.id === incident.id
                                    ? {
                                      ...ticket,
                                      ticketStatus: 'Open',
                                      status: 'Open',
                                      closureTime: '',
                                      closureComment: '',
                                      closedBy: '',
                                    }
                                    : ticket
                                )
                              );

                              console.log(`Ticket ${incident.id} reopened successfully`);
                            } catch (err) {
                              console.error('Failed to reopen ticket:', err);
                              alert('Failed to reopen ticket. Please try again.');
                            }
                          }}


                        >
                          Reopen
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {(incident.status === 'Closed' || incident.ticketStatus === 'Closed') ? (
                        <button
                          className="px-4 py-2 text-sm font-medium rounded-md bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                          onClick={async () => {
                            console.log("Approve clicked for incident ID:", incident.id); // <-- Add this
                            const username = 'AlphadeskTestuser';
                            const password = 'Qwerty1234';
                            const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

                            try {
                              const response = await axios.put(
                                `https://reportpool.alphamorganbank.com:8443/api/tickets`,
                                {
                                  id: incident.id,
                                  ticketStatus: 'Closed',
                                  closureComment: 'User has approved ticket',
                                  closureTime: new Date().toISOString(),

                                },

                                {
                                  headers: {
                                    Authorization: basicAuth,
                                    'Content-Type': 'application/json',
                                  },
                                }
                              );

                              console.log("Response:", response.data); // <-- Log response

                              settickets(prev =>
                                prev.map(t =>
                                  t.id === incident.id
                                    ? { ...t, ticketStatus: 'Closed', closureComment: 'User has approved ticket' }
                                    : t
                                )
                              );
                            } catch (err) {
                              console.error('Failed to approve ticket:', err); // <-- Check if anything shows here
                            }
                          }}

                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">Pending resolution</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      <button
                        onClick={() => handleViewTicket(incident)}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-orange-400 hover:bg-orange-300 text-white transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all duration-300 scale-100">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-3">
              Success!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your ticket has been submitted successfully. We'll get back to you soon!
            </p>

            {/* Action Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
              className="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50"
            >
              <span className="relative z-10">Perfect!</span>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      )}

      <Outlet />
    </DashboardLayout>
  );
};

export default UserDashboard;