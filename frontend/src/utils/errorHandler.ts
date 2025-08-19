/**
 * Utility function to safely extract error messages from various error structures
 * This prevents React error #31 when error objects are accidentally rendered
 */
export function getErrorMessage(error: any, fallback: string = 'An unexpected error occurred'): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    // Handle our custom API error structure
    if (error.message && typeof error.message === 'string') {
      return error.message;
    }
    
    // Handle axios error structure
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    // Handle nested data structure
    if (error.data?.message) {
      return error.data.message;
    }
    
    // Handle standard error objects
    if (error.message) {
      return error.message;
    }
  }
  
  return fallback;
}

/**
 * Safe error handler for async operations
 * Returns a standardized error message that can be safely displayed
 */
export function handleAsyncError(error: any, fallback?: string): string {
  console.warn('Error caught:', error);
  return getErrorMessage(error, fallback);
}
