'use client';

export default function PipelinePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-gray-600 mt-1">Drag and drop leads to manage your pipeline</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-5 gap-4">
          {['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((stage) => (
            <div key={stage} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">{stage}</h3>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition cursor-move">
                  <p className="text-sm font-medium text-gray-900">Lead #001</p>
                  <p className="text-xs text-gray-600">John Doe</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-center mt-8">Drag-and-drop pipeline interface coming soon</p>
      </div>
    </div>
  );
}
