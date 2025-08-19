import React from 'react';

const EnvDebug: React.FC = () => {
  // Only show in development
  if (import.meta.env.PROD) return null;

  const envVars = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_DEV_MODE': import.meta.env.VITE_DEV_MODE,
    'VITE_ENABLE_DEBUG': import.meta.env.VITE_ENABLE_DEBUG,
    'MODE': import.meta.env.MODE,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
    'BASE_URL': import.meta.env.BASE_URL,
  };

  return (
    <div className="fixed bottom-4 left-4 max-w-md bg-gray-900 text-white text-xs p-3 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
      <h4 className="font-bold mb-2 text-yellow-300">Environment Variables (DEV)</h4>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="text-blue-300">{key}:</span>{' '}
          <span className="text-green-300">
            {value ? `"${value}"` : '<undefined>'}
          </span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-700">
        <span className="text-yellow-300">Current URL:</span>{' '}
        <span className="text-green-300">{window.location.origin}</span>
      </div>
    </div>
  );
};

export default EnvDebug;
