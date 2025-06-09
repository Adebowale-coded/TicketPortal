import React, { useState } from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';
import InputField from '../../components/Inputfield';
import TextAreaField from '../../components/Textarea';
import SelectField from '../../components/Selectfield';

const IncidenceReport = () => {
  const [incidentData, setIncidentData] = useState({
    title: '',
    incidentDescription: '',
    reportedBy: '',
    incidentDate: '',
    incidentStatus: '',
    incidentCategory: '',
    resolutionNotes: '',
    resolvedAt: '',
    loggedTime: '',
    closedBy: '',
    closureTime: '',
    incidentPriority: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = 'https://reportpool.alphamorganbank.com:8443/api/incident'; // Replace with actual URL
    const username = 'sammyuser';
    const password = 'Alpha1234$';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': basicAuth,
        },
        body: JSON.stringify({ incident: incidentData }),
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
    setIncidentData({
      ...incidentData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <DashboardLayout>
      <div className="bg-white shadow-sm mx-auto mt-6 p-6 border border-gray-200 rounded-md max-w-full">
        <h2 className="mb-4 font-semibold text-xl">Submit Incidence Report</h2>

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

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default IncidenceReport;
