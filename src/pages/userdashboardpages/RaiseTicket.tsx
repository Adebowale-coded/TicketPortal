import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';
import InputField from '../../components/Inputfield';
import TextAreaField from '../../components/Textarea';
import SelectField from '../../components/Selectfield';
import axios from 'axios';

interface Ticket {
    id: string;
    incidentTitle: string;
    incidentDate: string;
    status: string;
    title?: string;
    loggedTime?: string;
    ticketStatus?: string;
}

const RaiseTicket = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    
    const rawUser = localStorage.getItem('username') || '';
    const user = rawUser
        .split('.')
        .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
        .join(' ');
    const userDept = localStorage.getItem('dept') || '';

    const [ticketData, setTicketData] = useState({
        title: '',
        ticketDescription: '',
        ticketPriority: '',
        requesterDept: userDept,
        requesterName: user,
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

    const resetForm = () => {
        setTicketData({
            title: '',
            ticketDescription: '',
            ticketPriority: '',
            requesterDept: userDept,
            requesterName: user,
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
        setFiles([]);
    };

    const openModal = () => {
        setIsModalOpen(true);
        resetForm();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add form validation
        if (!ticketData.title.trim()) {
            alert('Please enter a ticket title');
            return;
        }
        
        if (!ticketData.ticketDescription.trim()) {
            alert('Please enter a ticket description');
            return;
        }
        
        if (!ticketData.ticketPriority) {
            alert('Please select a priority');
            return;
        }
        
        setIsSubmitting(true);

        const now = new Date().toISOString();
        const formData = new FormData();

        const updatedTicketData = {
            ...ticketData,
            loggedTime: now,
        };

        formData.append('ticket', JSON.stringify(updatedTicketData));

        files.forEach((file) => {
            formData.append('attachment', file);
            console.log('Attached file:', file.name);
        });

        // Debug: Log form data
        console.log('Submitting ticket data:', updatedTicketData);

        const url = 'https://reportpool.alphamorganbank.com:8443/api/tickets';
        const username = 'Alphadeskuser';
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

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Success response:', responseData);
            
            alert('Ticket Submitted Successfully');
            
            // Close modal and reset form after successful submission
            closeModal();

            // Refresh tickets list after submission
            fetchTickets();
        } catch (error) {
            console.error('Error submitting ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTicketData({
            ...ticketData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;
        if (files) {
            setFiles(Array.from(files));
        }
    };

    const handleDelete = (id: string) => {
        // Placeholder for delete functionality
        console.log('Delete ticket with id:', id);
    };

    const fetchTickets = React.useCallback(async () => {
        if (!user) return;

        const username = 'Alphadeskuser';
        const password = 'Qwerty1234';
        const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

        try {
            console.log('Fetching tickets for user:', user);
            const response = await axios.get(
                'https://reportpool.alphamorganbank.com:8443/api/tickets',
                {
                    headers: {
                        Authorization: basicAuth,
                    },
                }
            );

            console.log('All tickets:', response.data);

            // Filter tickets by requesterName
            const userTickets = (response.data as Ticket[]).filter(
                (ticket) => (ticket as any).requesterName?.toLowerCase() === user.toLowerCase()
            );

            console.log('Filtered user tickets:', userTickets);
            setTickets(userTickets);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchTickets();

        // Poll every 15 seconds
        const interval = setInterval(fetchTickets, 15000);

        return () => clearInterval(interval);
    }, [fetchTickets]);

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className='font-[poppins] font-semibold'>Hello, {user}</h1>
                <button
                    onClick={openModal}
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
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="font-bold text-gray-800 text-2xl">Raise New Ticket</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-6">
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

                            <div className="flex md:flex-row flex-col gap-4">
                                <div className="w-full md:w-1/2">
                                    <InputField
                                        label="Requester Name *"
                                        name="requesterName"
                                        value={ticketData.requesterName}
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
                                        disabled
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

                            <div className="mb-4">
                                <label htmlFor="attachment" className="block mb-2 font-medium text-gray-700">
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
                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-2 rounded-md transition duration-300 font-medium ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tickets List */}
            <div className="bg-white shadow-md mx-auto mt-12 p-6 rounded-lg max-w-full">
                <h2 className="mb-4 font-bold text-gray-800 text-2xl">Submitted Tickets</h2>

                {tickets.length === 0 ? (
                    <p className="text-gray-500 italic">
                        {user ? 'No tickets found for this requester.' : 'Enter requester name to view tickets.'}
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
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 border-t">
                                        <td className="px-4 py-3">
                                            {ticket.incidentTitle || ticket.title || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {ticket.incidentDate ||
                                                (ticket.loggedTime ? new Date(ticket.loggedTime).toLocaleDateString() : 'N/A')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${(ticket.status === 'Closed' || ticket.ticketStatus === 'Closed')
                                                ? 'text-green-600 bg-green-100'
                                                : (ticket.status === 'In Progress' || ticket.ticketStatus === 'In Progress')
                                                    ? 'text-blue-600 bg-blue-100'
                                                    : 'text-orange-600 bg-orange-100'
                                                }`}>
                                                {ticket.status || ticket.ticketStatus || 'Open'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleDelete(ticket.id)}
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
        </DashboardLayout>
    );
};

export default RaiseTicket;