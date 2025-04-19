import { NavLink, useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext'; 

export default function Navbar() {
  const navigate = useNavigate();
  const { alertCount } = useAlert();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-stone-100 text-primary font-semibold rounded px-3 py-2 rounded-full'
      : 'text-white hover:bg-stone-100 hover:text-primary rounded px-3 py-2  rounded-full transition';

  return (
    <nav className="bg-primary shadow">
      <div className="w-full px-6 py-2 flex items-center justify-between">
        {/* LEFT: Nav Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/beneficiaries" className={linkClass}>Beneficiaries</NavLink>
          <NavLink to="/death-records" className={linkClass}>Death Records</NavLink>
          <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
          <NavLink to="/reports" className={linkClass}>Reports</NavLink>
          
          {/* ✅ Alerts with badge */}
          <NavLink to="/notifications" className={linkClass}>
            Alerts
            {alertCount > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {alertCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/users" className={linkClass}>Users</NavLink>
        </div>

        {/* RIGHT: Logout */}
        <div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
