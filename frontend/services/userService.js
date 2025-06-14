const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const userService = {
  getUsers: async () => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users`);
  },

  getUserById: async (id) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users/${id}`);
  },

  createUser: async (userData) => {
    console.log(userData)
    return makeAuthenticatedRequest(`${API_BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
  },

  followUser: async (userIdToFollow, followerId) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users/${userIdToFollow}/follow`, {
      method: 'POST',
      body: JSON.stringify({ followerId }),
    });
  },

  unfollowUser: async (userIdToUnfollow, followerId) => {
    return makeAuthenticatedRequest(`${API_BASE_URL}/users/${userIdToUnfollow}/follow`, {
      method: 'DELETE',
      body: JSON.stringify({ followerId }),
    });
  }
};