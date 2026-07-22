'use client';

export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sales Performance</h3>
          <p className="text-gray-500">Monthly sales report coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Conversion Rates</h3>
          <p className="text-gray-500">Pipeline conversion analysis coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <p className="text-gray-500">Lead attribution report coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
          <p className="text-gray-500">Rep-wise metrics coming soon</p>
        </div>
      </div>
    </div>
  );
}
