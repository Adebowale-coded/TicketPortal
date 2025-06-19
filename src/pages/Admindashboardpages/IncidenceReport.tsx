import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';
import IncidenceReportForm from '..//../components/IncidenceReportForm'; // this will be your current form component

const IncidencePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const username = 'Alphadeskuser';
    const password = 'Qwerty1234';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    try {
      const response = await fetch('https://reportpool.alphamorganbank.com:8443/api/incidents', {
        headers: {
          'Authorization': basicAuth,
        }
      });
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Incidence Reports</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            New Incidence Report
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-600 hover:text-black text-lg"
              >
                &times;
              </button>
              <IncidenceReportForm onSuccess={() => { setShowModal(false); fetchReports(); }} />
            </div>
          </div>
        )}

        {/* Reports Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border rounded bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Reported By</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: any, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{report.title}</td>
                  <td className="px-4 py-2">{report.incidentDescription}</td>
                  <td className="px-4 py-2">{report.incidentStatus}</td>
                  <td className="px-4 py-2">{report.incidentPriority}</td>
                  <td className="px-4 py-2">{report.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidencePage;
