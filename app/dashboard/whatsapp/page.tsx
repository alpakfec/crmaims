'use client';

export default function WhatsAppPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">WhatsApp Integration</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Active Conversations</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Messages Today</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-2">AI Responses</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h4 className="font-semibold text-blue-900 mb-2">Setup WhatsApp Integration</h4>
        <p className="text-blue-800 text-sm mb-4">
          To enable WhatsApp Business integration:
        </p>
        <ol className="text-sm text-blue-800 list-decimal list-inside space-y-2">
          <li>Get your WhatsApp Business API credentials</li>
          <li>Set the webhook URL: <code className="bg-blue-100 px-2 py-1 rounded">/api/whatsapp/webhook</code></li>
          <li>Configure environment variables with your credentials</li>
          <li>Enable Gemini API for AI-powered responses</li>
        </ol>
      </div>
    </div>
  );
}
