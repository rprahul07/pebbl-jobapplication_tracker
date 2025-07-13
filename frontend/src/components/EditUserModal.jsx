/**
 * EditUserModal component for editing user details in a popup modal.
 * Props: open (bool), user (object), onClose (fn), onSave (fn)
 */
import React, { useState, useEffect } from 'react';

const EditUserModal = ({ open, user, onClose, onSave }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'user');

  useEffect(() => {
    setEmail(user?.email || '');
    setRole(user?.role || 'user');
  }, [user]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ ...user, email, role }); }}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Role</label>
            <select className="w-full border rounded p-2" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal; 