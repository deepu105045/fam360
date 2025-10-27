import React from 'react';
import Router from './Router';
import { AuthProvider } from './hooks/use-auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
