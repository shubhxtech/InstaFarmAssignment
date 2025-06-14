import React from 'react';

export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slide-in ${
      notification.type === 'error' 
        ? 'bg-purple-500 text-white' 
        : 'bg-blue-500 text-white'
    }`}>
      {notification.message}
    </div>
  );
}