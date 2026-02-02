import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load pages to reduce initial bundle size
// We use a helper function to handle named exports for React.lazy
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ContractPage = lazy(() => import('./pages/ContractPage').then(module => ({ default: module.ContractPage })));
const PayrollPage = lazy(() => import('./pages/PayrollPage').then(module => ({ default: module.PayrollPage })));

// Simple loading spinner for page transitions
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">로딩 중...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;