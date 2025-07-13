/**
 * Applications page for Job Application Tracker.
 * Shows a table of job applications with sort, filter, and edit using global context.
 */
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['All', 'Applied', 'Interviewing', 'Offered', 'Rejected'];

const Applications = () => {
  const { applications } = useAppContext();
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const navigate = useNavigate();

  // Filter applications by status
  let filtered = status === 'All' ? applications : applications.filter(app => app.status === status);

  // Sort applications
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDir === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    } else {
      return sortDir === 'asc'
        ? (a[sortBy] || '').localeCompare(b[sortBy] || '')
        : (b[sortBy] || '').localeCompare(a[sortBy] || '');
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Applications</h1>
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <label className="font-semibold">Filter by status:</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded p-2">
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <label className="font-semibold ml-0 md:ml-4">Sort by:</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded p-2">
          <option value="date">Date</option>
          <option value="jobTitle">Job Title</option>
          <option value="company">Company</option>
          <option value="status">Status</option>
        </select>
        <button
          className="border rounded px-2 py-1"
          onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/applications/new')}
        >
          + New Application
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr>
              <th className="py-2">Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id} className="border-t">
                <td className="py-2">{app.jobTitle}</td>
                <td>{app.company}</td>
                <td>{app.status}</td>
                <td>{app.date}</td>
                <td>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications; 