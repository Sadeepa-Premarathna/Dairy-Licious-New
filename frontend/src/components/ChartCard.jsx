import React from 'react';

export default function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`chart-card ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="mr-3 text-primary-600">📈</span>
        {title}
      </h3>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
