import React from 'react';
import { Users, Search, Edit3, Trash2, Mail, Phone, Calendar, UserCheck, Heart } from 'lucide-react';
import UserCard from './UserCard';

export default function Dashboard({ users, searchTerm, setSearchTerm, setCurrentPage, setSelectedUser, handleDeleteUser, calculateAge }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="text-sm text-gray-600">
              {users.length} user{users.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first user account.
            </p>
            <button
              onClick={() => setCurrentPage('create')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Create First User
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                setCurrentPage={setCurrentPage}
                setSelectedUser={setSelectedUser}
                handleDeleteUser={handleDeleteUser}
                calculateAge={calculateAge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}