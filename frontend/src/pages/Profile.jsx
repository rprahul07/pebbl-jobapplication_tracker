/**
 * Profile page for Job Application Tracker.
 * Shows and allows editing of the logged-in user's profile (mock, context only).
 */
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
  const { user, dispatch } = useAppContext();
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'LOGIN', user: { ...user, email } });
    setEditing(false);
  };

  if (!user) return <div className="p-6">Not logged in.</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          {editing ? (
            <input className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} />
          ) : (
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">{user.email}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Role</label>
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">{user.role}</div>
        </div>
        <div className="flex gap-2 justify-end">
          {editing ? (
            <>
              <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => setEditing(false)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>Save</button>
            </>
          ) : (
            <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 