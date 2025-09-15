import React from 'react';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Reports & Analytics
              </h1>
              <p className="text-gray-600">
                Generate insights, analytics, and business reports
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="glass-card text-center animate-fade-in-up animation-delay-200">
          <div className="py-16">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics Module</h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              The Reports & Analytics module is currently under development. This module will include business intelligence, data visualization, custom reports, and analytical insights.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-pink-100 text-pink-800 rounded-lg font-semibold">
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

export default Reports;
