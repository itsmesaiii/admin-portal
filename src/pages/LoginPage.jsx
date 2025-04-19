import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = form.username.trim().toLowerCase();
    const password = form.password.trim().toLowerCase();

    // ✅ Only allow 2 valid admins
    const isValidAdmin =
      (username === 'anita' && password === 'anita') ||
      (username === 'krishnan' && password === 'krishnan');

    if (isValidAdmin) {
      try {
        // ✅ Send login to backend (with role)
        await fetch('http://localhost:3001/api/users/logins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, role: 'Admin' }),
        });
      } catch (err) {
        console.error('❌ Failed to log login:', err);
      }

      // ✅ Save dummy token and navigate
      localStorage.setItem('token', 'dummy');
      navigate('/dashboard');
    } else {
      alert('❌ Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <img src="/images/tn-logo.png" alt="Tamil Nadu Logo" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-xl md:text-2xl font-bold text-green-800">
          தமிழ்நாடு அரசு | Government of Tamil Nadu
        </h1>
        <p className="text-sm md:text-base text-gray-700 mt-1">
          வருவாய் நிருவாகம் மற்றும் பேரிடர் மேலாண்மை ஆணையகம்<br />
          Commissionerate of Revenue Administration and Disaster Management
        </p>
      </div>

      {/* Admin Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

        <label className="block mb-2 text-sm">Username / பயனாளர் பெயர்</label>
        <input
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <label className="block mb-2 text-sm">Password / கடவுச்சொல்</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
        >
          Login / உள்நுழைய
        </button>

        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={() => alert('Password reset coming soon!')}
            className="text-sm px-4 py-1 rounded-full border border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
          >
            Forgot Password? / கடவுச்சொல் மறந்துவிட்டதா?
          </button>
        </div>
      </form>
    </div>
  );
}
