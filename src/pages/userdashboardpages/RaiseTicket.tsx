import React, { useState } from 'react';

import DashboardLayout from '../../layouts/Dashboardlayouts';
import InputField from '../../components/Inputfield'; // Adjust path if different
import TextAreaField from '../../components/Textarea';
import SelectField from '../../components/Selectfield';

const RaiseTicket = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
                    'Content-type': 'Application/JSON'
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
    return (
        <DashboardLayout>
            <form
                onSubmit={handleSubmit}
                className="mt-8 w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Raise Ticket</h2>

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
