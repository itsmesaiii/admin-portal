import { useState, useEffect } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Dashboard() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [deathRecords, setDeathRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, dRes] = await Promise.all([
          api.get('/beneficiaries'),
          api.get('/death-records'),
        ]);
        setBeneficiaries(bRes.data);
        setDeathRecords(dRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = beneficiaries.length;
  const active = beneficiaries.filter(b => b.status === 'Active').length;
  const pending = beneficiaries.filter(b => b.status === 'Pending').length;
  const deceased = beneficiaries.filter(b => b.status === 'Deceased').length;

  const activeAadhaars = new Set(
    beneficiaries.filter(b => b.status === 'Active').map(b => b.aadhaarNumber)
  );
  const matchedDeaths = deathRecords.filter(d =>
    activeAadhaars.has(d.aadhaarNumber)
  );

  const recentDeaths = deathRecords
    .sort((a, b) => new Date(b.dateOfDeath) - new Date(a.dateOfDeath))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-sm text-gray-500">Total Beneficiaries</h2>
                <p className="text-2xl font-bold text-primary">{total}</p>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-sm text-gray-500">Active</h2>
                <p className="text-2xl font-bold text-green-700">{active}</p>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-sm text-gray-500">Pending</h2>
                <p className="text-2xl font-bold text-yellow-600">{pending}</p>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-sm text-gray-500">Deceased</h2>
                <p className="text-2xl font-bold text-red-700">{deceased}</p>
              </div>
            </div>

            {/* Alerts */}
            {matchedDeaths.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow">
                <strong>⚠️ Alert:</strong> {matchedDeaths.length} potential deceased matches with active beneficiaries. Review needed.
              </div>
            )}

            {/* Recent Death Records */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Recent Death Records</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded shadow">
                  <thead className="bg-stone-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Aadhaar</th>
                      <th className="px-4 py-3">Date of Death</th>
                      <th className="px-4 py-3">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentDeaths.map(r => (
                      <tr key={r.id} className="hover:bg-stone-50">
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2">{r.aadhaarNumber}</td>
                        <td className="px-4 py-2">
                          {new Date(r.dateOfDeath).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{r.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
