import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BeneficiaryManagement from './pages/BeneficiaryManagement';
import DeathRecordIntegration from './pages/DeathRecordIntegration';
import TransactionLogs from './pages/TransactionLogs';
import ReportsAnalytics from './pages/ReportsAnalytics';
import Notifications from './pages/Notifications';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* all other routes require auth */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/beneficiaries" element={<BeneficiaryManagement />} />
        <Route path="/death-records" element={<DeathRecordIntegration />} />
        <Route path="/transactions" element={<TransactionLogs />} />
        <Route path="/reports" element={<ReportsAnalytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}
