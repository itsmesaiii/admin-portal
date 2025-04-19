import { useEffect, useState } from 'react';
import GovHeader from '../components/GovHeader';
import Navbar from '../components/Navbar';
import api from '../api';
import {
  FaUsers,
  FaUserAltSlash,
  FaUserCheck,
  FaFileAlt,
  FaCheckDouble,
  FaRupeeSign,
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ReportsAnalytics() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [deathRecords, setDeathRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const benRes = await api.get('/beneficiaries');
      const deathRes = await api.get('/death-records');
      setBeneficiaries(benRes.data);
      setDeathRecords(deathRes.data);
    };

    fetchData();
  }, []);

  const totalBeneficiaries = beneficiaries.length;
  const totalDeceased = beneficiaries.filter((b) => b.status === 'Deceased').length;
  const totalActive = beneficiaries.filter((b) => b.status === 'Active').length;
  const totalDeathRecords = deathRecords.length;

  const activeAadhaars = new Set(
    beneficiaries.filter(b => b.status === 'Active').map(b => b.aadhaarNumber)
  );
  const matchedDeaths = deathRecords.filter(d => 
    activeAadhaars.has(d.aadhaarNumber)
  ).length;

  const estimatedFundsDisbursed = totalActive * 1000;

  const totalFund = 5561.31;

  const schemes = [
    { name: 'IGNOAPS', beneficiaries: 1418073, fund: 60, pension: 1200 },
    { name: 'IGNDPS', beneficiaries: 62109, fund: 3, pension: 1500 },
    { name: 'IGNWPS', beneficiaries: 508042, fund: 12, pension: 1200 },
    { name: 'DAPS', beneficiaries: 439178, fund: 7, pension: 1500 },
    { name: 'DWPS', beneficiaries: 667036, fund: 10, pension: 1200 },
    { name: 'CMUPT', beneficiaries: 248262, fund: 4, pension: 1200 },
    { name: 'DDWPS', beneficiaries: 118407, fund: 2, pension: 1200 },
    { name: 'UWP', beneficiaries: 25542, fund: 1, pension: 1200 },
    { name: 'Refugees', beneficiaries: 4320, fund: 1, pension: 1200 },
  ];

  const barColors = [
    '#1e3a8a',
    '#2563eb',
    '#1d4ed8',
    '#9333ea',
    '#b91c1c',
    '#0d9488',
    '#c2410c',
    '#ca8a04',
    '#059669',
  ];

  const fundPercentages = schemes.map(s => s.fund);

  const beneficiaryData = {
    labels: schemes.map((s) => s.name),
    datasets: [
      {
        label: 'Beneficiaries',
        data: schemes.map((s) => s.beneficiaries),
        backgroundColor: barColors,
      },
    ],
  };

  const fundData = {
    labels: schemes.map((s) => s.name),
    datasets: [
      {
        label: 'Fund Allocation (%)',
        data: fundPercentages,
        backgroundColor: barColors,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface">
      <GovHeader />
      <Navbar />

      <main className="p-6 space-y-8">
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>

        {/* Stat Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <StatCard title="Total Beneficiaries" value={totalBeneficiaries} icon={<FaUsers className="text-blue-600" />} />
          <StatCard title="Deceased Beneficiaries" value={totalDeceased} icon={<FaUserAltSlash className="text-gray-800" />} />
          <StatCard title="Active Beneficiaries" value={totalActive} icon={<FaUserCheck className="text-green-600" />} />
          <StatCard title="Death Records Submitted" value={totalDeathRecords} icon={<FaFileAlt className="text-gray-700" />} />
          <StatCard title="Verified Matches Found" value={matchedDeaths} icon={<FaCheckDouble className="text-yellow-600" />} />
          <StatCard title="Funds Disbursed (Estimated)" value={`₹${estimatedFundsDisbursed.toLocaleString()}`} icon={<FaRupeeSign className="text-emerald-600" />} />
        </div>

        {/* 📊 Scheme Overview Charts */}
        <div className="space-y-10">
          <h2 className="text-xl font-semibold">Scheme-wise Overview</h2>

          {/* Bar chart - Beneficiaries by Scheme */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">Beneficiaries by Scheme</h3>
            <div style={{ height: '400px' }}>
              <Bar data={beneficiaryData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Pie chart - Fund Allocation */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-md font-medium mb-2">Fund Allocation by Scheme (%)</h3>
            <div style={{ height: '400px' }}>
              <Pie
                data={fundData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = fundPercentages[context.dataIndex];
                          const amount = ((value / 100) * totalFund).toFixed(2);
                          return `${label}: ₹${amount} Cr (${value}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* 📋 Fund Allocation Table */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-md font-medium mb-4">Detailed Scheme Allocation</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded">
                <thead className="bg-slate-100 text-xs uppercase text-slate-700">
                  <tr>
                    <th className="px-4 py-2">Scheme</th>
                    <th className="px-4 py-2">Beneficiaries</th>
                    <th className="px-4 py-2">Per Person / Month</th>
                    <th className="px-4 py-2">Estimated Fund (Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((scheme, i) => {
                    const yearlyFund = (scheme.beneficiaries * scheme.pension * 12) / 1e7;
                    return (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2 text-slate-800 font-medium ">{scheme.name}</td>
                        <td className="px-4 py-2 text-gray-700">{scheme.beneficiaries.toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-700">₹{scheme.pension}</td>
                        <td className="px-4 py-2 text-gray-700">₹{yearlyFund.toFixed(2)} Cr</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
