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

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      return data.owner;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  signup: async (ownerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      return data.owner;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  }
};