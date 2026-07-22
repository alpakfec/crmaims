'use client';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <p className="text-gray-500">Edit your profile information coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">API Integrations</h3>
          <p className="text-gray-500">Manage API keys and integrations coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Management</h3>
          <p className="text-gray-500">Manage users and permissions coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <p className="text-gray-500">Customize notifications coming soon</p>
        </div>
      </div>
    </div>
  );
}
