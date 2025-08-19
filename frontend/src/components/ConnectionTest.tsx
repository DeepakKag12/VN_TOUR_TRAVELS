import React, { useState, useEffect } from 'react';
import { testConnection } from '../api';

const ConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'failed'>('testing');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [lastTried, setLastTried] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Get the API URL being used
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    setApiUrl(envUrl || 'Not set');

    // Test connection
  const runTest = async () => {
      try {
    setLastTried(new Date().toLocaleTimeString());
        const result = await testConnection();
        if (result.success) {
          setConnectionStatus('success');
        } else {
          setConnectionStatus('failed');
          setErrorDetails(result.error || 'Unknown error');
        }
      } catch (error: any) {
        setConnectionStatus('failed');
        setErrorDetails(error?.message || 'Connection test failed');
      }
    };

    runTest();
  }, []);

  const retryConnection = async () => {
    setConnectionStatus('testing');
    setErrorDetails('');
    
    try {
      setLastTried(new Date().toLocaleTimeString());
      const result = await testConnection();
      if (result.success) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('failed');
        setErrorDetails(result.error || 'Unknown error');
      }
    } catch (error: any) {
      setConnectionStatus('failed');
      setErrorDetails(error?.message || 'Connection test failed');
    }
  };

  return (
    <div className="fixed top-4 right-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-sm font-semibold mb-2">API Connection Status</h3>
      
      <div className="text-xs text-gray-600 mb-2">
        <strong>API URL:</strong> {apiUrl}
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' :
          connectionStatus === 'success' ? 'bg-green-400' : 'bg-red-400'
        }`}></div>
        <span className="text-sm">
          {connectionStatus === 'testing' && 'Testing connection...'}
          {connectionStatus === 'success' && 'Connected'}
          {connectionStatus === 'failed' && 'Connection failed'}
        </span>
      </div>
      
      {errorDetails && (
        <div className="text-[11px] text-red-700 mb-2 bg-red-50 p-2 rounded space-y-1">
          <div><strong>Error:</strong> {errorDetails}</div>
          <div className="text-[10px] text-red-500">Tried: {lastTried} | Online: {String(navigator.onLine)}</div>
          <div className="text-[10px] text-slate-500">If this shows 'No response', likely CORS or network block. Open the health URL in a new tab to confirm.</div>
        </div>
      )}
      
      {connectionStatus === 'failed' && (
        <button 
          onClick={retryConnection}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionTest;
