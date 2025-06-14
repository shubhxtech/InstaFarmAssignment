import React from 'react';
import { Edit3, Trash2, Mail, Phone, Calendar, UserCheck, Heart } from 'lucide-react';

export default function UserCard({ user, setCurrentPage, setSelectedUser, handleDeleteUser, calculateAge }) {
  const age = calculateAge(user.dateOfBirth);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600 font-medium">Age: {age} years</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedUser(user); setCurrentPage('edit'); }}
            className="p-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all border-2 border-transparent hover:border-blue-200"
            title="Edit User"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border-2 border-transparent hover:border-red-200"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium">{user.phone}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">{user.following.length} Following</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <Heart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">{user.followers.length} Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}