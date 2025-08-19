/**
 * Debug utility to help identify React error #31 issues
 * This helps catch when non-React elements are being rendered
 */
import React from 'react';

// Development-only component validator
export function validateReactElement(element: any, componentName: string = 'Component'): boolean {
  if (typeof element === 'string' || typeof element === 'number' || element === null || element === undefined) {
    return true; // These are valid React children
  }
  
  if (React.isValidElement(element)) {
    return true; // Valid React element
  }
  
  if (Array.isArray(element)) {
    return element.every((child, index) => validateReactElement(child, `${componentName}[${index}]`));
  }
  
  // Check for common problematic objects
  if (typeof element === 'object') {
    if (element.hasOwnProperty('code') && element.hasOwnProperty('message')) {
      console.error(`❌ React Error #31 detected in ${componentName}: Attempting to render error object:`, element);
      console.error('This will cause "Minified React error #31". Convert to string first.');
      return false;
    }
    
    if (element.hasOwnProperty('response') || element.hasOwnProperty('status')) {
      console.error(`❌ React Error #31 detected in ${componentName}: Attempting to render HTTP response object:`, element);
      console.error('This will cause "Minified React error #31". Extract message property first.');
      return false;
    }
    
    console.error(`❌ React Error #31 detected in ${componentName}: Attempting to render plain object:`, element);
    console.error('Objects cannot be rendered as React children. Convert to string or JSX first.');
    return false;
  }
  
  return true;
}

// Safe render wrapper for development
export function safeRender(element: any, fallback: React.ReactNode = null, componentName: string = 'Component'): React.ReactNode {
  if (import.meta.env.DEV) {
    if (!validateReactElement(element, componentName)) {
      console.warn(`Using fallback for invalid element in ${componentName}`);
      return fallback;
    }
  }
  return element;
}

export default validateReactElement;
