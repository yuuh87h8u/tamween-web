import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './hooks/useAppStore';
import { trpc, trpcClient } from './lib/trpc';
import LoginSelection from './pages/LoginSelection';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Banking from './pages/Banking';
import Shopping from './pages/Shopping';
import Bills from './pages/Bills';
import Health from './pages/Health';
import AIAssistant from './pages/AIAssistant';

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login-selection" replace />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="banking" element={<Banking />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="bills" element={<Bills />} />
          <Route path="health" element={<Health />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;