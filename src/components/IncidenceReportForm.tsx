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
                body: JSON.stringify({
                    "title": "Email Server Downtime",
                    "incidentDescription": "The company email server went offline at 10:45 AM, affecting all departments' ability to send or receive emails.",
                    "reportedBy": "Tolu Adesina",
                    "incidentDate": "2025-06-19T10:45:00Z",
                    "incidentStatus": "Resolved",
                    "incidentCategory": "Network Infrastructure",
                    "resolutionNotes": "Restarted the email server and updated SMTP configuration. Services restored at 11:20 AM.",
                    "resolvedAt": "2025-06-19T11:20:00Z",
                    "loggedTime": "2025-06-19T10:50:00Z",
                    "closedBy": "Bayo Okonkwo",
                    "closureTime": "2025-06-19T11:30:00Z",
                    "incidentPriority": "High"
                }),
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
        <div className="max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20">
            {/* Header with gradient background */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg border-b border-blue-500 shadow-sm z-10">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    New Incident Report
                </h2>
                <p className="text-blue-100 text-sm mt-1 opacity-90">Report and track system incidents efficiently</p>
            </div>

            {/* Scrollable form content */}
            <div className="p-6 space-y-1">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Form sections with better organization */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            Basic Information
                        </h3>
                        <div className="space-y-4">
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
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            Incident Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Incident Date"
                                name="incidentDate"
                                type="date"
                                value={incidentData.incidentDate}
                                onChange={handleChange}
                            />

                            <SelectField
                                label="Priority *"
                                name="incidentPriority"
                                value={incidentData.incidentPriority}
                                onChange={handleChange}
                                options={['Low', 'Medium', 'High']}
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
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            Resolution Information
                        </h3>
                        <TextAreaField
                            label="Resolution Notes"
                            name="resolutionNotes"
                            value={incidentData.resolutionNotes}
                            onChange={handleChange}
                            placeholder="Steps taken to resolve the incident"
                        />
                    </div>

                    {/* Enhanced submit button section */}
                    <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 mt-8">
                        <div className="flex justify-end items-center gap-4">
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="text-red-500">*</span>
                                Required fields
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 rounded-lg text-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Submit Report
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncidenceReportForm;