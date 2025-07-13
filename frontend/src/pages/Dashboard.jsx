/**
 * Dashboard page for Job Application Tracker.
 * Shows status summary, recent applications, and a pie chart using global context.
 */
import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const statusColors = {
  Applied: '#3b82f6',
  Interviewing: '#f59e42',
  Offered: '#22c55e',
  Rejected: '#ef4444',
};

const Dashboard = () => {
  const { applications } = useAppContext();

  // Aggregate status counts
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  // Data for Recharts
  const chartData = Object.entries(statusCounts).map(([status, value]) => ({
    status,
    value,
  }));

  // Latest 5 applications
  const recent = [...applications]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    // Dark gradient background (matches Login)
    <div className="min-h-screen flex items-start md:items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 overflow-y-auto">
      {/* Glass‑morphic main panel */}
      <div className="relative z-10 w-full max-w-5xl bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg border border-opacity-10 border-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Dashboard
        </h1>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.keys(statusColors).map((status) => (
            <div
              key={status}
              className="flex flex-col items-center justify-center p-4 rounded-xl shadow-md transform transition hover:scale-[1.02]"
              style={{
                background: `${statusColors[status]}22`,
                color: statusColors[status],
              }}
            >
              <span className="text-lg font-semibold">{status}</span>
              <span className="text-3xl font-extrabold">
                {statusCounts[status] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Pie chart */}
        <div className="bg-white bg-opacity-10 rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={statusColors[entry.status]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend
                wrapperStyle={{ color: 'white' }}
                iconType="circle"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent applications table */}
        <div className="bg-white bg-opacity-10 rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Recent Applications
          </h2>
          <table className="w-full text-white text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="py-3 px-2">Job Title</th>
                <th className="px-2">Company</th>
                <th className="px-2">Status</th>
                <th className="px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((app) => (
                <tr
                  key={app.id}
                  className="border-t border-gray-700 hover:bg-white hover:bg-opacity-5 transition"
                >
                  <td className="py-3 px-2">{app.jobTitle}</td>
                  <td className="px-2">{app.company}</td>
                  <td className="px-2">{app.status}</td>
                  <td className="px-2">
                    {new Date(app.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
