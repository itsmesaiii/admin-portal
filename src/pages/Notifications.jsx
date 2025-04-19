import { useEffect, useState } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatchedRecords = async () => {
    try {
      const res = await api.get('/death-records/matches');
      console.log('🔍 Matched Alerts:', res.data);
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch matched records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedRecords();
  }, []);

  const handleMarkAsDeceased = async (aadhaarNumber, name) => {
    try {
      await api.put(`/beneficiaries/${aadhaarNumber}/mark-deceased`);
      alert(`${name} has been marked as deceased`);

      // 🔄 Re-fetch updated matches to remove alert + update badge
      fetchMatchedRecords();
    } catch (err) {
      console.error(err);
      alert('Failed to mark as deceased');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Notifications & Alerts</h1>

        {loading ? (
          <p>Loading...</p>
        ) : alerts.length === 0 ? (
          <p className="text-gray-500"> ✅ No pending matches at this time.</p>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded shadow-md space-y-1"
            >
              <h2 className="font-medium text-lg text-yellow-800">
                Possible Match Found 
              </h2>
              <p><strong>Name:</strong> {alert.name || 'N/A'}</p>
              <p><strong>Aadhaar:</strong> {alert.aadhaarNumber}</p>
              <p><strong>Date of Death:</strong> {new Date(alert.dateOfDeath).toLocaleDateString()}</p>
              <p><strong>Source:</strong> {alert.source}</p>
          
              <div className="mt-2 flex gap-4">
                <a
                  href={`http://localhost:3001/uploads/${alert.proofFilePath}`}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Proof PDF
                </a>
                <button
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  onClick={() => handleMarkAsDeceased(alert.aadhaarNumber, alert.name)}
                >
                  Mark as Deceased
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
