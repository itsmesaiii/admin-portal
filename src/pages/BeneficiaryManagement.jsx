import { useState, useEffect } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function BeneficiaryManagement() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await api.get('/beneficiaries');
        const sorted = res.data.sort((a,b) => a.id - b.id);
        setBeneficiaries(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch beneficiaries');
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const markAsDeceased = async (aadhaarNumber) => {
    if (!window.confirm('Are you sure you want to mark this beneficiary as deceased?')) return;

    try {
      await api.put(`/beneficiaries/${String(aadhaarNumber)}/mark-deceased`);
      alert('Marked as deceased successfully');

      // Refresh data
      const res = await api.get('/beneficiaries');
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setBeneficiaries(sorted);
    } catch (err) {
      console.error(err);
      alert('Failed to mark as deceased');
    }
  };

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.aadhaarNumber.includes(search)
  );

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const downloadCSV = () => {
    const headers = ['Name', 'Aadhaar Number', 'Status', 'Scheme', 'Last Certification'];
    const rows = filtered.map(b => [
      b.name,
      b.aadhaarNumber,
      b.status,
      b.scheme,
      new Date(b.lastCertification).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beneficiaries.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Beneficiary Management</h1>

        <input
          type="text"
          placeholder="Search by name or Aadhaar"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md p-2 border rounded"
        />

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded shadow border border-gray-200">
              <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-1">
                <thead className="bg-stone-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Aadhaar</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Scheme</th>
                    <th className="px-4 py-3">Last Certification</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(b => (
                    <tr key={b.id} className="bg-white shadow-sm hover:shadow rounded-lg transition">
                      <td className="px-4 py-3 rounded-l-lg">{b.name}</td>
                      <td className="px-4 py-3">{b.aadhaarNumber}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            b.status === 'Deceased'
                              ? 'bg-red-100 text-red-700 rounded-full'
                              : b.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 rounded-full'
                              : 'bg-green-100 text-green-800 rounded-full'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{b.scheme}</td>
                      <td className="px-4 py-3">
                        {new Date(b.lastCertification).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 rounded-r-lg flex gap-2">
                        <button
                          onClick={() => markAsDeceased(b.aadhaarNumber)}
                          disabled={b.status === 'Deceased'}
                          className={`text-xs px-3 py-1 rounded ${
                            b.status === 'Deceased'
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed rounded-full'
                              : 'bg-red-600 text-white hover:bg-red-700 rounded-full'
                          }`}
                        >
                          Mark as Deceased
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination + Export Controls */}
            <div className="mt-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-primary text-white text-sm px-4 py-1.5 rounded disabled:opacity-50 rounded-full"
                >
                  ← Previous
                </button>

                <span className="text-sm font-medium text-gray-800">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-primary text-white text-sm px-4 py-1.5 rounded disabled:opacity-50 rounded-full"
                >
                  Next →
                </button>
              </div>

              <button
                onClick={downloadCSV}
                className="bg-accent text-white px-4 py-1.5 rounded hover:bg-primary-light text-sm rounded-full"
              >
                Download CSV
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
