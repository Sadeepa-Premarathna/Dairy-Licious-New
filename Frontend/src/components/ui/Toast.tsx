import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg ${bgColor} ${textColor} max-w-sm`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className={`w-5 h-5 mr-3 ${iconColor}`} />
        ) : (
          <XCircle className={`w-5 h-5 mr-3 ${iconColor}`} />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 p-1 hover:bg-opacity-20 hover:bg-gray-600 rounded ${iconColor}`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;