import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddTransaction from './pages/AddTransaction';
import AssetManagement from './pages/AssetManagement';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import ExpenseManagement from './pages/ExpenseManagement';
import FamilySelect from './pages/FamilySelect';
import FamilySettings from './pages/FamilySettings';
import SpendingAnalysis from './pages/SpendingAnalysis';
import Tasks from './pages/Tasks';
import Transactions from './pages/Transactions';
import FamilyPage from './pages/FamilyPage';
import CreateFamily from './pages/CreateFamily';
import MainLayout from './layouts/MainLayout';

const Router: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/asset-management" element={<AssetManagement />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expense-management" element={<ExpenseManagement />} />
          <Route path="/family-select" element={<FamilySelect />} />
          <Route path="/family-settings" element={<FamilySettings />} />
          <Route path="/spending-analysis" element={<SpendingAnalysis />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/family/:familyId" element={<FamilyPage />} />
          <Route path="/family/create" element={<CreateFamily />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
