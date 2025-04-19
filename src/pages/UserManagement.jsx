import { useEffect, useState } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaoRes] = await Promise.all([
          api.get('/users/vao'),
          api.get('/users/logins'),
        ]);

        const vaoUsers = vaoRes.data.map((user, i) => ({
          id: 1000 + i,
          name:user.name,
          role: user.role || 'VAO',
          lastLogin: user.lastLogin || 'N/A',
        }));
        setUsers([ ...vaoUsers]);
      } catch (err) {
        console.error('Failed to fetch users or login data:', err);
      }
    };

    fetchData();
  }, []);

  const handleDeactivate = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = users.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">User Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold tracking-wider">Name</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wider">Role</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50">
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3">
                    {user.lastLogin !== 'N/A'
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 rounded-full">
                      Edit Permissions
                    </button>
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 rounded-full"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="bg-primary text-white px-4 py-1.5 rounded disabled:opacity-50 rounded-full"
          >
            ← Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="bg-primary text-white px-4 py-1.5 rounded disabled:opacity-50 rounded-full"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}
