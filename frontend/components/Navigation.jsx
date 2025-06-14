import React from 'react';
import { Users, UserPlus, LogOut } from 'lucide-react';

export default function Navigation({ currentOwner, currentPage, setCurrentPage, handleLogout, setSelectedUser }) {
  return (
    <nav className="bg-white shadow-xl border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management System</h1>
              <p className="text-gray-600 text-sm">{currentOwner?.organizationName}</p>
            </div>
          </div>

          {/* Navigation Buttons and User Info */}
          <div className="flex items-center space-x-6">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-5 py-2 rounded-xl font-medium transition-all ${
                  currentPage === 'dashboard' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setCurrentPage('create'); setSelectedUser(null); }}
                className={`px-5 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                  currentPage === 'create' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4 pl-6 border-l-2 border-gray-200">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{currentOwner?.name}</p>
                <p className="text-sm text-gray-600">{currentOwner?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}