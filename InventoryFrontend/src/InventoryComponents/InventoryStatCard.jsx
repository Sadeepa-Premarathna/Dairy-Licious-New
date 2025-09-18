import React from 'react';

export default function StatCard({ title, value, delta, deltaType = 'neutral', sparkline, icon }) {
  const getDeltaColor = () => {
    switch (deltaType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDeltaIcon = () => {
    switch (deltaType) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {icon && (
              <div className="mr-3 text-2xl text-primary-600">
                {icon}
              </div>
            )}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {delta && (
            <p className={`text-sm font-semibold ${getDeltaColor()}`}>
              {getDeltaIcon()} {delta}
            </p>
          )}
        </div>
        {sparkline && (
          <div className="w-20 h-16 flex-shrink-0">
            {sparkline}
          </div>
        )}
      </div>
    </div>
  );
}
