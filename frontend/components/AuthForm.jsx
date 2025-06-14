import React, { useState } from 'react';
import { Users, Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';

export default function AuthForm({ isLogin, onSubmit, onToggle, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (isLogin) {
      if (formData.email && formData.password) {
        onSubmit(formData.email, formData.password);
      }
    } else {
      if (formData.name && formData.email && formData.password && formData.organizationName) {
        onSubmit(formData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Set up your organization'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {!isLogin && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Organization Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                    placeholder="Enter organization name"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Please wait...
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Toggle Button */}
          <div className="text-center">
            <button
              onClick={onToggle}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Demo Accounts */}
          {isLogin && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Demo Accounts</p>
              </div>
              <div className="space-y-2">
                <div className="bg-white/70 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-600 mb-1">School 1</p>
                  <p className="text-sm text-gray-800">alice@school1.com / password123</p>
                </div>
                <div className="bg-white/70 p-3 rounded-xl">
                  <p className="text-xs font-medium text-gray-600 mb-1">School 2</p>
                  <p className="text-sm text-gray-800">bob@school2.com / password123</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}