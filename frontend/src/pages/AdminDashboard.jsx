/**
 * AdminDashboard page for Job Application Tracker.
 * Glassmorphic dark theme version.
 */
import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import EditUserModal from '../components/EditUserModal';

const users = [
  { id: 1, email: 'admin@example.com', role: 'admin' },
  { id: 2, email: 'user1@example.com', role: 'user' },
  { id: 3, email: 'user2@example.com', role: 'user' },
];

const applications = [
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    company: 'Acme Corp',
    status: 'Applied',
    date: '2024-06-01',
    owner: 'user1@example.com',
  },
  {
    id: 2,
    jobTitle: 'Backend Engineer',
    company: 'Beta LLC',
    status: 'Interviewing',
    date: '2024-05-28',
    owner: 'user2@example.com',
  },
  {
    id: 3,
    jobTitle: 'Fullstack Dev',
    company: 'Gamma Inc',
    status: 'Rejected',
    date: '2024-05-25',
    owner: 'user1@example.com',
  },
  {
    id: 4,
    jobTitle: 'QA Tester',
    company: 'Delta Ltd',
    status: 'Applied',
    date: '2024-05-20',
    owner: 'user2@example.com',
  },
  {
    id: 5,
    jobTitle: 'DevOps',
    company: 'Epsilon',
    status: 'Offered',
    date: '2024-05-18',
    owner: 'user1@example.com',
  },
];

const statusColors = {
  Applied: '#3b82f6',
  Interviewing: '#f59e42',
  Offered: '#22c55e',
  Rejected: '#ef4444',
};

const AdminDashboard = () => {
  const [userList, setUserList] = useState(users);
  const [appList, setAppList] = useState(applications);
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const statusCounts = appList.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(statusCounts).map(([status, value]) => ({
    status,
    value,
  }));

  const handleDeleteUser = (id) => {
    setUserList((list) => list.filter((u) => u.id !== id));
  };
  const handleDeleteApp = (id) => {
    setAppList((list) => list.filter((a) => a.id !== id));
  };
  const handleEditUser = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };
  const handleSaveUser = (updatedUser) => {
    setUserList(list => list.map(u => u.id === updatedUser.id ? updatedUser : u));
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl shadow-2xl p-6 md:p-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Status Cards */}
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

        {/* Pie Chart */}
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
                  <Cell key={entry.status} fill={statusColors[entry.status]} />
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

        {/* Users Table */}
        <EditUserModal open={modalOpen} user={editUser} onClose={() => setModalOpen(false)} onSave={handleSaveUser} />
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="py-2">{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEditUser(user)}>Edit</button>
                    {user.role !== 'admin' && (
                      <button className="text-red-600 hover:underline" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Applications Table */}
        <div className="bg-white bg-opacity-10 rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            All Applications
          </h2>
          <table className="w-full text-white text-left min-w-[600px]">
            <thead>
              <tr className="text-gray-300">
                <th className="py-2">Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Date</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appList.map((app) => (
                <tr
                  key={app.id}
                  className="border-t border-gray-700 hover:bg-white hover:bg-opacity-5 transition"
                >
                  <td className="py-2">{app.jobTitle}</td>
                  <td>{app.company}</td>
                  <td>{app.status}</td>
                  <td>{app.date}</td>
                  <td>{app.owner}</td>
                  <td>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteApp(app.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {appList.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No applications found.
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

export default AdminDashboard;