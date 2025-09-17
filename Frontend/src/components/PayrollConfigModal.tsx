import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';

interface PayrollConfig {
  epfRate: number;
  etfRate: number;
  overtimeRate: number;
  standardHours: number;
  allowances: {
    transport: number;
    meal: number;
    medical: number;
  };
}

interface PayrollConfigModalProps {
  config: PayrollConfig;
  onClose: () => void;
  onSave: (config: PayrollConfig) => void;
}

const PayrollConfigModal: React.FC<PayrollConfigModalProps> = ({ config, onClose, onSave }) => {
  const [editedConfig, setEditedConfig] = useState<PayrollConfig>(config);

  const handleSave = () => {
    onSave(editedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payroll Configuration</h2>
              <p className="text-gray-600 mt-1">Manage payroll calculation settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Deduction Rates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deduction Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EPF Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editedConfig.epfRate}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      epfRate: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Employee Provident Fund contribution rate</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ETF Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editedConfig.etfRate}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      etfRate: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Employee Trust Fund contribution rate</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Hours per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={editedConfig.standardHours}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      standardHours: parseInt(e.target.value) || 8
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Standard working hours per day</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overtime Rate Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editedConfig.overtimeRate}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      overtimeRate: parseFloat(e.target.value) || 1.5
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Overtime pay rate multiplier (e.g., 1.5x)</p>
                </div>
              </div>
            </div>

            {/* Allowances */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Allowances ($)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editedConfig.allowances.transport}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      allowances: {
                        ...editedConfig.allowances,
                        transport: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Allowance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editedConfig.allowances.meal}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      allowances: {
                        ...editedConfig.allowances,
                        meal: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Allowance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editedConfig.allowances.medical}
                    onChange={(e) => setEditedConfig({
                      ...editedConfig,
                      allowances: {
                        ...editedConfig.allowances,
                        medical: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Configuration Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">EPF Deduction:</span>
                  <span className="ml-2 font-medium">{editedConfig.epfRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">ETF Deduction:</span>
                  <span className="ml-2 font-medium">{editedConfig.etfRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Standard Hours:</span>
                  <span className="ml-2 font-medium">{editedConfig.standardHours}h/day</span>
                </div>
                <div>
                  <span className="text-gray-600">Overtime Rate:</span>
                  <span className="ml-2 font-medium">{editedConfig.overtimeRate}x</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Allowances:</span>
                  <span className="ml-2 font-medium">
                    ${Object.values(editedConfig.allowances).reduce((sum, val) => sum + val, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollConfigModal;