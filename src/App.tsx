import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightsPage } from './components/RightsPage';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ShareholdingPage } from './components/ShareholdingPage';
import { EmployeeCredentialsPage } from './components/EmployeeCredentialsPage';
import { PayslipReports } from './components/PayslipReports';
import { CaptchaPage } from './components/CaptchaPage';
import { AdminPersonnelPage } from './components/AdminPersonnelPage';
import { API_BASE } from './config';

const rightsMeInFlight = { value: false };

function useRightsMe() {
  const navigate = useNavigate();
  const [allowedSections, setAllowedSections] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAllowedSections(null);
      return;
    }
    if (rightsMeInFlight.value) return;
    rightsMeInFlight.value = true;
    let cancelled = false;
    fetch(`${API_BASE}/api/rights/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('authToken');
          if (!cancelled) navigate('/login', { replace: true });
          return { sections: [] };
        }
        return res.ok ? res.json() : Promise.reject(res);
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data?.sections)) {
          setAllowedSections(data.sections);
        } else if (!cancelled) {
          setAllowedSections(null);
        }
      })
      .catch(() => {
        if (!cancelled) setAllowedSections(null);
      })
      .finally(() => {
        rightsMeInFlight.value = false;
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);
  return allowedSections;
}

const AppShell: React.FC = () => {
  const [activeMenu, setActiveMenu] = React.useState<string>('Management');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const allowedSections = useRightsMe();

  React.useEffect(() => {
    if (allowedSections == null || allowedSections.length === 0) return;
    setActiveMenu((current) =>
      allowedSections.includes(current) ? current : allowedSections[0],
    );
  }, [allowedSections]);

  const renderContent = () => {
    if (activeMenu === 'Company Secretary') {
      return <ShareholdingPage />;
    }
    if (activeMenu === 'HR') {
      return <EmployeeCredentialsPage />;
    }
    if (activeMenu === 'Payslip') {
      return <PayslipReports />;
    }
    if (activeMenu === 'IT Dept') {
      return <CaptchaPage />;
    }
    if (activeMenu === 'Admin & Personnel') {
      return <AdminPersonnelPage />;
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
          allowedSections={allowedSections}
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

