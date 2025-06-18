import React, { useState } from 'react';

import DashboardLayout from '../../layouts/Dashboardlayouts';
import InputField from '../../components/Inputfield'; // Adjust path if different
import TextAreaField from '../../components/Textarea';
import SelectField from '../../components/Selectfield';

const RaiseTicket = () => {
    const [isSubmitting] = useState(false);
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
    return (
        <DashboardLayout>
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
        </DashboardLayout>
    );
};

export default RaiseTicket;
