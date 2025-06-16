import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Heart } from 'lucide-react';
import { userService } from '../services/userService';
export default function UserForm({ user, onSubmit, onCancel, title, users, loading }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth?.slice(0, 10) || '',
  });
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    if (user && user.following) {
      setFollowingUsers(user.following);
    }
  }, [user, users]);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.phone && formData.dateOfBirth) {
      const userData = { ...formData, following: followingUsers.map(u => u.id) };
      
      if (user) {
        onSubmit(user.id, userData);
      } else {
        onSubmit(userData);
      }
    }
  };

  const addFollowing = async (userId) => {
    if (!user?.id) return;

    const userToAdd = users.find(u => u.id === userId);
    if (userToAdd && !followingUsers.find(u => u.id === userId)) {
      setIsProcessing(true);
      try {
        const updatedFollowing = [...followingUsers, userToAdd];
        setFollowingUsers(updatedFollowing);
        await userService.followUser(userId, user.id);
      } catch (error) {
        console.error('Error following user:', error);
        setFollowingUsers(followingUsers);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const removeFollowing = async (userId) => {
    if (!user?.id) return;

    setIsProcessing(true);
    try {
      const updatedFollowing = followingUsers.filter(u => u.id !== userId);
      setFollowingUsers(updatedFollowing);
      await userService.unfollowUser(userId, user.id);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setFollowingUsers(followingUsers);
    } finally {
      setIsProcessing(false);
    }
  };

  const availableUsers = users.filter(u => 
    u.id !== user?.id && !followingUsers.find(f => f.id === u.id)
  );

  const followers = user?.followers || [];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
      
      <div className="space-y-8">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter full name"
              disabled={loading || isProcessing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter email address"
              disabled={loading || isProcessing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter phone number"
              disabled={loading || isProcessing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading || isProcessing}
            />
          </div>
        </div>

        {user && (
          <div className="space-y-6">
            {/* Following Section */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Following ({followingUsers.length})</h3>
              </div>
              
              {followingUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {followingUsers.map(followedUser => (
                    <div key={followedUser.id} className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium">{followedUser.name}</span>
                      <button
                        onClick={() => removeFollowing(followedUser.id)}
                        className="ml-2 text-blue-600 hover:text-red-500 transition-colors"
                        disabled={isProcessing}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {availableUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableUsers.map(availableUser => (
                    <button
                      key={availableUser.id}
                      onClick={() => addFollowing(availableUser.id)}
                      className="flex items-center bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-sm"
                      disabled={isProcessing}
                    >
                      <Plus className="w-4 h-4 text-blue-600 mr-1" />
                      {availableUser.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Followers Section */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Followers ({followers.length})</h3>
              </div>
              
              {followers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {followers.map(follower => (
                    <div key={follower.id} className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">
                          {follower.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{follower.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 text-sm">No followers yet</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading || isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
          </button>
          <button
            onClick={onCancel}
            disabled={loading || isProcessing}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}