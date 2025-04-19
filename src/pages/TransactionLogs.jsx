import { useState, useEffect } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Transactions() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/transactions');
        const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sorted);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      }
    };

    fetchLogs();
  }, []);

  const filtered = logs.filter(log =>
    log.name.toLowerCase().includes(search.toLowerCase()) ||
    log.aadhaarNumber.includes(search) ||
    log.type.toLowerCase().includes(search.toLowerCase())
  );

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const downloadCSV = () => {
    const headers = ['Aadhaar Number', 'Name', 'Type', 'Status', 'Performed By', 'Timestamp'];
    const rows = filtered.map(l => [
      l.aadhaarNumber,
      l.name,
      l.type,
      l.status,
      l.performedBy,
      new Date(l.timestamp).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_logs.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Transaction Logs</h1>

        <input
          type="text"
          placeholder="Search by name, Aadhaar, or type"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md p-2 border rounded"
        />

        <div className="overflow-x-auto border rounded shadow">
          <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-1">
            <thead className="bg-stone-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">Aadhaar</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Performed By</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(log => (
                <tr key={log.id} className="bg-white shadow-sm hover:shadow rounded-lg transition">
                  <td className="px-4 py-3 rounded-l-lg">{log.aadhaarNumber}</td>
                  <td className="px-4 py-3">{log.name}</td>
                  <td className="px-4 py-3">{log.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      log.status === 'Success'
                        ? 'bg-green-100 text-green-800 rounded-full'
                        : 'bg-red-100 text-red-800 rounded-full'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.performedBy}</td>
                  <td className="px-4 py-3 rounded-r-lg">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination + CSV */}
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
      </main>
    </div>
  );
}
