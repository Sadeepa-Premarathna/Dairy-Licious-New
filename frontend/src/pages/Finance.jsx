import React from 'react';

const Finance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                💰 Finance & Accounting
              </h1>
              <p className="text-gray-600">
                Monitor revenue, expenses, and financial reports
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="glass-card text-center animate-fade-in-up animation-delay-200">
          <div className="py-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finance Module</h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              The Finance & Accounting module is currently under development. This module will include revenue tracking, expense management, financial reports, and accounting features.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold">
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

export default Finance;
