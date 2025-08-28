import React from 'react';

const DevError: React.FC = () => {
  // This component intentionally throws an error for testing error boundaries
  throw new Error('This is a test error for error boundary testing');
};

export default DevError;
