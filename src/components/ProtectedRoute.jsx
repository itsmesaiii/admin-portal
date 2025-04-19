import { Outlet, Navigate } from 'react-router-dom';

// replace with your real auth check
const isAuthenticated = () => !!localStorage.getItem('token');

export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
