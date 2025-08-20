import React, { useEffect, useState } from 'react';
import InputField from '../components/Inputfield';
import TextAreaField from '../components/Textarea';
import SelectField from '../components/Selectfield';

type Props = {
    onSuccess: () => void; // callback to close modal and refresh table
    report?: any;
};

const IncidenceReportForm = ({ report, onSuccess }: Props) => {
    const rawUser = localStorage.getItem('username') || '';
    const user = rawUser
        .split('.')
        .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
        .join(' ');

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [incidentData, setIncidentData] = useState({
        title: "",
        incidentDescription: "",
        reportedBy: user,
        incidentDate: "",
        incidentStatus: "",
        incidentCategory: "",
        resolutionNotes: "",
        resolvedAt: "2025-06-19T10:45:00",
        loggedTime: "2025-06-19T10:45:00",
        closedBy: "",
        closureTime: "2025-06-19T10:45:00",
        incidentPriority: "",
    });


    // In case report changes after first render (optional but recommended):
    useEffect(() => {
        if (report) {
            setIncidentData({
                title: report.title || "",
                incidentDescription: report.incidentDescription || "",
                reportedBy: report.reportedBy || user,
                incidentDate: report.incidentDate || "",
                incidentStatus: report.incidentStatus || "",
                incidentCategory: report.incidentCategory || "",
                resolutionNotes: report.resolutionNotes || "",
                resolvedAt: report.resolvedAt || "2025-06-19T10:45:00",
                loggedTime: report.loggedTime || "2025-06-19T10:45:00",
                closedBy: report.closedBy || "",
                closureTime: report.closureTime || "2025-06-19T10:45:00",
                incidentPriority: report.incidentPriority || "",
            });
        }
    }, [report]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setIncidentData({
            ...incidentData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        const now = new Date();
        const time = now.toTimeString().slice(0, 8); // "HH:mm:ss"

        setIncidentData({
            ...incidentData,
            [e.target.name]: `${selectedDate}T${time}`,
        });
    };

    const getLocalISOString = () => {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const username = 'Alphadeskuser';
        const password = 'Qwerty1234';
        const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

        const isEditMode = !!report;

        // The correct API URL for both POST and PUT
        const url = 'https://reportpool.alphamorganbank.com:8443/api/incidents';

        const payload = {
            ...incidentData,
            ...(isEditMode && { id: report.id }),
            loggedTime: getLocalISOString(),
            resolvedAt: getLocalISOString(),
            closureTime: getLocalISOString()
        };

        console.log("Submitting payload:", payload); // for debug

        try {
            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    Authorization: basicAuth,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();

            if (!response.ok) {
                console.error('API error response:', responseText);
                alert(`Error: ${response.status} - ${response.statusText}`);
                return;
            }

            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Fetch error:', error);
            alert(`Network or fetch error: ${error.message}`);
        }
    };


    /* const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = 'Alphadeskuser';
        const password = 'Qwerty1234';
        const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

        
        const isEditMode = !!report;
        const url = 'https://reportpool.alphamorganbank.com:8443/api/incidents';

        const formData = new FormData();

        formData.append("title", incidentData.title);
        formData.append("incidentDescription", incidentData.incidentDescription);
        formData.append("reportedBy", incidentData.reportedBy);
        formData.append("incidentDate", incidentData.incidentDate);
        formData.append("incidentStatus", incidentData.incidentStatus);
        formData.append("incidentCategory", incidentData.incidentCategory);
        formData.append("resolutionNotes", incidentData.resolutionNotes);
        formData.append("resolvedAt", incidentData.resolvedAt);
        formData.append("loggedTime", incidentData.loggedTime);
        formData.append("closedBy", incidentData.closedBy);
        formData.append("closureTime", incidentData.closureTime);
        formData.append("incidentPriority", incidentData.incidentPriority);

        try {
            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    Authorization: basicAuth,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incidentData),
            });

            const responseBody = await response.text();

            if (!response.ok) {
                console.error('API error response:', responseBody);

                try {
                    const errorJson = JSON.parse(responseBody);
                    alert(`Error: ${errorJson.message || JSON.stringify(errorJson)}`);
                } catch {
                    alert(`Error: ${responseBody}`);
                }

                return;
            }

            // Show success modal instead of alert
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Fetch error:', error);
            alert(`Network or fetch error: ${error.message}`);
        }
    }; */

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onSuccess(); // close modal and refresh list
    };

    return (
        <>
            <div className="max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/20">
                {/* Header with gradient background */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 rounded-t-lg border-b border-orange-500 shadow-sm z-10">
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
                                    label="Incident Title *"
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
                                    disabled
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
                                    value={incidentData.incidentDate.split('T')[0]} // Only the date part
                                    onChange={handleDateOnlyChange}
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
                                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-8 py-3 rounded-lg text-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center gap-2"
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-[#00000076] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                            <p className="text-green-100 text-sm">Your incident report has been submitted</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 text-center">
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Report Submitted Successfully</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Your incident report has been successfully submitted and is now being processed.
                                    You will receive updates on the status of your report.
                                </p>
                            </div>

                            {/* Success details */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Reported by:</span>
                                    <span className="font-medium text-gray-800">{incidentData.reportedBy}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-gray-600">Title:</span>
                                    <span className="font-medium text-gray-800 truncate ml-2">{incidentData.title}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-gray-600">Priority:</span>
                                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${incidentData.incidentPriority === 'High' ? 'bg-red-100 text-red-800' :
                                        incidentData.incidentPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {incidentData.incidentPriority}
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSuccessModalClose}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IncidenceReportForm;