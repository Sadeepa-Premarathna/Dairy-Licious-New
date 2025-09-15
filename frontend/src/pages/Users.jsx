import React from 'react';

const Users = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                👤 User Management
              </h1>
              <p className="text-gray-600">
                Manage customer accounts, roles, and permissions
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="glass-card text-center animate-fade-in-up animation-delay-200">
          <div className="py-16">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management Module</h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              The User Management module is currently under development. This module will include customer account management, role assignments, permissions, and user analytics.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-teal-100 text-teal-800 rounded-lg font-semibold">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
