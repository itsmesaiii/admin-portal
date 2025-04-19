import { useEffect, useState } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function DeathRecordIntegration() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Manual form state
  const [aadhaar, setAadhaar] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/death-records');
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecords(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch death records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filtered = records.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.aadhaarNumber.includes(search)
  );

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Death Record Integration</h1>

        {/* Auto-Fetch Section */}
        <section className="bg-white shadow rounded p-4 space-y-2">
          <h2 className="text-lg font-semibold">Auto-Fetch Death Records</h2>
          <p className="text-sm text-gray-600">
            Sync with central government death registration database.
          </p>
          <button className="bg-accent text-white px-4 py-1.5 rounded hover:bg-primary-light text-sm rounded-full">
            Sync Now
          </button>
        </section>

        {/* Manual Entry Form */}
        <section className="bg-white shadow rounded p-4 space-y-4">
          <h2 className="text-lg font-semibold">Manual Entry</h2>
          <form
            className="space-y-3"
            onSubmit={async e => {
              e.preventDefault();
              if (!aadhaar || !name || !date || !file) {
                alert('Please fill all fields and upload a PDF file.');
                return;
              }

              try {
                setSubmitting(true);
                const formData = new FormData();
                formData.append('aadhaarNumber', aadhaar);
                formData.append('name', name);
                formData.append('dateOfDeath', date);
                formData.append('source', 'Manual');
                formData.append('proofFile', file);

                await api.post('/death-records', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });

                alert('Death record submitted successfully');

                // Reset form
                setAadhaar('');
                setName('');
                setDate('');
                setFile(null);

                // Refresh table
                const res = await api.get('/death-records');
                setRecords(res.data);
              } catch (err) {
                console.error(err);
                alert('Failed to submit death record');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Aadhaar Number"
                value={aadhaar}
                onChange={e => {
                  const val = e.target.value;
                  // Allow only digits, limit to 12
                  if (/^\d{0,12}$/.test(val)) {
                    setAadhaar(val);
                  }
                }}
                className="p-2 border rounded"
                maxLength={12}
              />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setFile(e.target.files[0])}
                className="p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-light text-sm rounded-full"
            >
              {submitting ? 'Submitting...' : 'Confirm Death & Notify Banks'}
            </button>
          </form>
        </section>

        {/* Search */}
        <input
          type="text"
          placeholder="Search records by name or Aadhaar"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md p-2 border rounded"
        />

        {/* Records Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-200 rounded shadow">
              <table className="min-w-full text-sm border-separate border-spacing-y-1 text-gray-800">
                <thead className="bg-stone-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Aadhaar</th>
                    <th className="px-4 py-3">Date of Death</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(record => (
                    <tr
                      key={record.id}
                      className="bg-white hover:bg-stone-50 transition rounded"
                    >
                      <td className="px-4 py-3 rounded-l-lg">{record.name}</td>
                      <td className="px-4 py-3">{record.aadhaarNumber}</td>
                      <td className="px-4 py-3">
                        {new Date(record.dateOfDeath).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{record.source}</td>
                      <td className="px-4 py-3 rounded-r-lg">
                        <a
                          href={`http://localhost:3001/uploads/${record.proofFilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-accent text-white px-3 py-1 rounded text-xs hover:bg-primary-light rounded-full">
                            View PDF
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
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
            </div>
          </>
        )}
      </main>
    </div>
  );
}
