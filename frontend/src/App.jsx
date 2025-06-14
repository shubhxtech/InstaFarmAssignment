import React, { useState, useEffect } from 'react';
import { authService, userService } from '../services/api';
import AuthForm from '../components/AuthForm';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import UserForm from '../components/UserForm';
import Notification from '../components/Notification';
import { calculateAge } from '../utils/helpers';

export default function UserManagementApp() {
  const [currentOwner, setCurrentOwner] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
      const { id, email } = payload;
      setCurrentOwner({ id, email }); // minimally restore session
      setCurrentPage('dashboard');
    } catch (error) {
      console.error("Invalid or expired token", error);
      localStorage.removeItem('auth_token');
    }
  }
}, []);

  useEffect(() => {
    if (currentOwner) {
      loadUsers();
    }
  }, [currentOwner]);

  const loadUsers = async () => {
    if (!currentOwner) return;
    setLoading(true);
    try {
      const userData = await userService.getUsers();
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      showNotification('Error loading users', 'error');
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const owner = await authService.login(email, password);
      setCurrentOwner(owner);
      setCurrentPage('dashboard');
      showNotification(`Welcome back, ${owner.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Invalid email or password', 'error');
    }
    setLoading(false);
  };

  const handleSignup = async (ownerData) => {
    setLoading(true);
    try {
      const owner = await authService.signup(ownerData);
      setCurrentOwner(owner);
      setCurrentPage('dashboard');
      showNotification(`Welcome, ${owner.name}! Your account has been created.`);
    } catch (error) {
      console.error('Signup error:', error);
      showNotification(error.message || 'Error creating account', 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentOwner(null);
    setUsers([]);
    setCurrentPage('login');
    setSelectedUser(null);
    setSearchTerm('');
    showNotification('Logged out successfully');
  };

  const handleCreateUser = async (userData) => {
    setLoading(true);
    try {
      // Add validation to check if userData is defined
      if (!userData) {
        throw new Error('User data is required');
      }
      
      console.log('Creating user with data:', userData);
      const newUser = await userService.createUser(userData);
      console.log('User created successfully:', newUser);
      
      await loadUsers();
      setCurrentPage('dashboard');
      showNotification('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification(error.message || 'Error creating user', 'error');
    }
    setLoading(false);
  };

  const handleUpdateUser = async (id,userData) => {
    setLoading(true);
    try {
      
      
      console.log('Updating user with data:', id,userData);
      const updatedUser = await userService.updateUser(id,userData);
      console.log('User updated successfully:', updatedUser);
      await loadUsers();
      setCurrentPage('dashboard');
      setSelectedUser(null); // Clear selected user after update
      showNotification('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification(error.message || 'Error updating user', 'error');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!id) {
      showNotification('Invalid user ID', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        console.log('Deleting user with ID:', id);
        await userService.deleteUser(id);
        await loadUsers();
        showNotification('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        showNotification(error.message || 'Error deleting user', 'error');
      }
      setLoading(false);
    }
  };

  // Add safety checks for filteredUsers
  const filteredUsers = Array.isArray(users)
    ? users.filter(user => {
        if (!user) return false;
        const name = user.name || '';
        const email = user.email || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  if (!currentOwner) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Notification notification={notification} />
        <AuthForm
          isLogin={currentPage === 'login'}
          onSubmit={currentPage === 'login' ? handleLogin : handleSignup}
          onToggle={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        currentOwner={currentOwner}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
        setSelectedUser={setSelectedUser}
      />
      <Notification notification={notification} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currentPage === 'dashboard' && (
          <Dashboard
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            setSelectedUser={setSelectedUser}
            handleDeleteUser={handleDeleteUser}
            calculateAge={calculateAge}
          />
        )}
        {currentPage === 'create' && (
          <UserForm
            onSubmit={handleCreateUser}
            title="Create New User"
            users={users}
            loading={loading}
          />
        )}
        {currentPage === 'edit' && selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            title="Edit User"
            users={users}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}