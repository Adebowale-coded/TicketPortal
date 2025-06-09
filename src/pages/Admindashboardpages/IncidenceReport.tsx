import React from 'react';
import DashboardLayout from '../../layouts/Dashboardlayouts';

const IncidenceReport = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-6 bg-white shadow-sm p-6 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Submit Incidence Report</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Brief title of the incident"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the incident in detail"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Where did it happen?"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Incident
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default IncidenceReport;
