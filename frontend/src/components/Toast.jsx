/**
 * Toast notification component (mock version).
 * Shows a notification at the top right and auto-hides after 2s.
 */
import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  );
};

export default Toast; 