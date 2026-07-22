'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalLeads: 0,
    openLeads: 0,
    closedWon: 0,
    pipelineValue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/leads?limit=1');
      const data = await response.json();
      setStats({
        totalLeads: data.pagination.total,
        openLeads: Math.floor(data.pagination.total * 0.6),
        closedWon: Math.floor(data.pagination.total * 0.2),
        pipelineValue: 1250000,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const chartData = [
    { name: 'Week 1', leads: 12, deals: 3 },
    { name: 'Week 2', leads: 18, deals: 5 },
    { name: 'Week 3', leads: 15, deals: 4 },
    { name: 'Week 4', leads: 22, deals: 7 },
  ];

  const stageData = [
    { name: 'New Lead', value: 45 },
    { name: 'Contacted', value: 32 },
    { name: 'Qualified', value: 28 },
    { name: 'Proposal', value: 15 },
    { name: 'Won', value: 12 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name}!</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Leads" value={stats.totalLeads} icon="📊" />
        <MetricCard title="Open Leads" value={stats.openLeads} icon="🔓" />
        <MetricCard title="Closed Won" value={stats.closedWon} icon="✅" />
        <MetricCard title="Pipeline Value" value={`₹${(stats.pipelineValue / 100000).toFixed(1)}L`} icon="💰" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#3B82F6" name="Leads" />
              <Line type="monotone" dataKey="deals" stroke="#10B981" name="Deals" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-blue-200 hover:bg-blue-50 rounded-lg transition text-left">
            <p className="font-semibold text-blue-900">+ Add New Lead</p>
            <p className="text-sm text-blue-700">Create a new prospect</p>
          </button>
          <button className="p-4 border-2 border-green-200 hover:bg-green-50 rounded-lg transition text-left">
            <p className="font-semibold text-green-900">📞 View Tasks</p>
            <p className="text-sm text-green-700">See pending follow-ups</p>
          </button>
          <button className="p-4 border-2 border-purple-200 hover:bg-purple-50 rounded-lg transition text-left">
            <p className="font-semibold text-purple-900">📊 Reports</p>
            <p className="text-sm text-purple-700">View sales reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
