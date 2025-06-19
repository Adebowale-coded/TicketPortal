import React, { useState } from 'react';
import InputField from '../components/Inputfield';
import TextAreaField from '../components/Textarea';
import SelectField from '../components/Selectfield';

type Props = {
    onSuccess: () => void; // callback to close modal and refresh table
};

const IncidenceReportForm = ({ onSuccess }: Props) => {
    const [incidentData, setIncidentData] = useState({
        title: "Email Server Downtime",
        incidentDescription: "The company email server went offline at 10:45 AM, affecting all departments' ability to send or receive emails.",
        reportedBy: "Tolu Adesina",
        incidentDate: "2025-06-19T10:45:00Z",
        incidentStatus: "Resolved",
        incidentCategory: "Network Infrastructure",
        resolutionNotes: "Restarted the email server and updated SMTP configuration. Services restored at 11:20 AM.",
        resolvedAt: "2025-06-19T11:20:00Z",
        loggedTime: "2025-06-19T10:50:00Z",
        closedBy: "Bayo Okonkwo",
        closureTime: "2025-06-19T11:30:00Z",
        incidentPriority: "High"
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setIncidentData({
            ...incidentData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = 'https://reportpool.alphamorganbank.com:8443/api/incidents';
        const username = 'Alphadeskuser';
        const password = 'Qwerty1234';
        const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: basicAuth,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incidentData),
            });

            const responseBody = await response.text(); // handle both JSON and plain text

            if (!response.ok) {
                console.error('API error response:', responseBody);

                // Try to parse if it's JSON
                try {
                    const errorJson = JSON.parse(responseBody);
                    alert(`Error: ${errorJson.message || JSON.stringify(errorJson)}`);
                } catch {
                    alert(`Error: ${responseBody}`);
                }

                return; // stop further execution
            }

            alert('Incident report submitted successfully!');
            onSuccess(); // close modal and refresh list
        } catch (error: any) {
            console.error('Fetch error:', error);
            alert(`Network or fetch error: ${error.message}`);
        }
    };


    return (
        <div>
            <h2 className="mb-4 font-semibold text-lg">New Incidence Report</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <InputField
                    label="Ticket Title *"
                    name="title"
                    value={incidentData.title}
                    onChange={handleChange}
                    placeholder="Brief title of the incident"
                />

                <TextAreaField
                    label="Incident Description *"
                    name="incidentDescription"
                    value={incidentData.incidentDescription}
                    onChange={handleChange}
                    placeholder="Detailed description of the incident"
                />

                <InputField
                    label="Reported By *"
                    name="reportedBy"
                    value={incidentData.reportedBy}
                    onChange={handleChange}
                    placeholder="Full name or email of the reporter"
                />

                <InputField
                    label="Incident Date"
                    name="incidentDate"
                    type="date"
                    value={incidentData.incidentDate}
                    onChange={handleChange}
                />

                <SelectField
                    label="Incident Status"
                    name="incidentStatus"
                    value={incidentData.incidentStatus}
                    onChange={handleChange}
                    options={['Open', 'In Progress', 'Closed']}
                />

                <InputField
                    label="Incident Category"
                    name="incidentCategory"
                    value={incidentData.incidentCategory}
                    onChange={handleChange}
                    placeholder="e.g., Network, Software, Hardware"
                />

                <InputField
                    label="Resolution Notes"
                    name="resolutionNotes"
                    value={incidentData.resolutionNotes}
                    onChange={handleChange}
                    placeholder="Steps taken to resolve the incident"
                />

                <SelectField
                    label="Priority *"
                    name="incidentPriority"
                    value={incidentData.incidentPriority}
                    onChange={handleChange}
                    options={['Low', 'Medium', 'High']}
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white transition"
                    >
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IncidenceReportForm;
