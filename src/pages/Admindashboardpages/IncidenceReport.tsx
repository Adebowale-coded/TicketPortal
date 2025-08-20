import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';
import IncidenceReportForm from '../../components/IncidenceReportForm'; // this will be your current form component



const IncidencePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

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
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Incidence Reports</h2>
            <p className="text-sm text-gray-600">Monitor and manage security incidents</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Incidence Report
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative border border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedReport(null); // clear selection on close
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                &times;
              </button>

              <IncidenceReportForm
                report={selectedReport}
                onSuccess={() => {
                  setShowModal(false);
                  setSelectedReport(null);
                  fetchReports();
                }}
              />
            </div>
          </div>
        )}


        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Description</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Priority</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Reported By</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="truncate max-w-[200px]" title={report.incidentDescription}>
                        {report.incidentDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.incidentStatus === 'Open' ? 'bg-red-100 text-red-800' :
                        report.incidentStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          report.incidentStatus === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {report.incidentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.incidentPriority === 'High' ? 'bg-red-100 text-red-800' :
                        report.incidentPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          report.incidentPriority === 'Low' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {report.incidentPriority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{report.reportedBy}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 rounded-md transition bg-orange-100 hover:bg-orange-200 text-orange-500 cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {reports.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first incidence report.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Create Report
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>


  );
};

export default IncidencePage;
