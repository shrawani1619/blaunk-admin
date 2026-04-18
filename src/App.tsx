import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightsPage } from './components/RightsPage';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ShareholdingPage } from './components/ShareholdingPage';
import { EmployeeCredentialsPage } from './components/EmployeeCredentialsPage';
import { CaptchaPage } from './components/CaptchaPage';
import { AdminPersonnelPage } from './components/AdminPersonnelPage';
import { FinancePage } from './components/FinancePage';
import { MAUploadPage } from './components/MAUploadPage';
import { SalesPage } from './components/SalesPage';
import { PayslipDashboardPage } from './components/PayslipDashboardPage';
import { CustomerCarePage } from './components/CustomerCarePage';
import { RetailShopPage } from './components/RetailShopPage';
import { DsaPage } from './components/DsaPage';
import { VerifierPage } from './components/VerifierPage';
import { RetailManagementPage } from './components/RetailManagementPage';

const AppShell: React.FC = () => {
  const [activeMenu, setActiveMenu] = React.useState<string>('Management');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const renderContent = () => {
    if (activeMenu === 'Company Secretary') {
      return <ShareholdingPage />;
    }
    if (activeMenu === 'HR') {
      return <EmployeeCredentialsPage />;
    }
    if (activeMenu === 'IT Dept') {
      return <CaptchaPage />;
    }
    if (activeMenu === 'Admin & Personnel') {
      return <AdminPersonnelPage />;
    }
    if (activeMenu === 'Finance') {
      return <FinancePage />;
    }
    if (activeMenu === 'M & A') {
      return <MAUploadPage />;
    }
    if (activeMenu === 'Sales') {
      return <SalesPage />;
    }
    if (activeMenu === 'Payslip') {
      return <PayslipDashboardPage />;
    }
    if (activeMenu === 'Customer Care') {
      return <CustomerCarePage />;
    }
    if (activeMenu === 'Retail Shop') {
      return <RetailShopPage />;
    }
    if (activeMenu === 'DSA') {
      return <DsaPage />;
    }
    if (activeMenu === 'Verifier') {
      return <VerifierPage />;
    }
    if (activeMenu === 'RETAIL MANAGEMENT') {
      return <RetailManagementPage />;
    }
    return <RightsPage />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 pt-16">
        <Sidebar
          activeMenu={activeMenu}
          onChangeActive={setActiveMenu}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="ml-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:ml-60 sm:px-6 lg:px-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function ProtectedShell() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AppShell />;
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<ProtectedShell />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
