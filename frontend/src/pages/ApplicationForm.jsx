/**
 * ApplicationForm page for Job Application Tracker.
 * Shows a form to add or edit a job application using global context.
 */
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const statusOptions = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

const ApplicationForm = ({ isEdit = false, onSave }) => {
  const { applications, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  // If editing, find the application by id
  const initial = isEdit ? applications.find(app => String(app.id) === String(id)) || {} : {};

  const [jobTitle, setJobTitle] = useState(initial.jobTitle || '');
  const [company, setCompany] = useState(initial.company || '');
  const [status, setStatus] = useState(initial.status || 'Applied');
  const [notes, setNotes] = useState(initial.notes || '');
  const [date, setDate] = useState(initial.date || new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (isEdit && !initial.id) {
      // If editing but not found, redirect
      navigate('/applications');
    }
    // eslint-disable-next-line
  }, [isEdit, initial.id, navigate]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const app = {
      id: isEdit ? initial.id : Date.now(),
      jobTitle,
      company,
      status,
      notes,
      date,
    };
    dispatch({ type: isEdit ? 'EDIT_APP' : 'ADD_APP', app });
    onSave && onSave();
    navigate('/applications');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'New'} Application</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Job Title</label>
          <input className="w-full border rounded p-2" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Company</label>
          <input className="w-full border rounded p-2" value={company} onChange={e => setCompany(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Status</label>
          <select className="w-full border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Date Applied</label>
          <input type="date" className="w-full border rounded p-2" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Notes</label>
          <textarea className="w-full border rounded p-2" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
      </form>
    </div>
  );
};

export default ApplicationForm; 