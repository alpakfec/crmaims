'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Lead {
  _id: string;
  leadNumber: number;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  source: string;
  status: string;
  whatsappOptIn?: boolean;
  createdAt: string;
  pipelineStageId?: { name?: string };
  assignedTo?: { name?: string; email?: string };
}

interface Interaction {
  _id: string;
  type: string;
  direction?: string;
  summary: string;
  timestamp: string;
  performedBy?: { name?: string; email?: string };
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leadId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!leadId) {
      return;
    }

    const fetchLead = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leads/${leadId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load lead');
        }

        setLead(data.data.lead);
        setInteractions(data.data.interactions || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load lead');
        toast.error(err.message || 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-white p-6 shadow">Loading lead details...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-red-600">{error || 'Lead not found.'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            ← Back
          </button>
          <Link href="/dashboard/leads" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all leads
          </Link>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          lead.status === 'open'
            ? 'bg-green-100 text-green-800'
            : lead.status === 'closed_won'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {lead.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Lead #{lead.leadNumber}</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="mt-2 text-gray-600">{lead.phone}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            <p><span className="font-medium">Source:</span> {lead.source}</p>
            <p><span className="font-medium">WhatsApp opt-in:</span> {lead.whatsappOptIn ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
            <dl className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Email</dt>
                <dd>{lead.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">City</dt>
                <dd>{lead.city || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Stage</dt>
                <dd>{lead.pipelineStageId?.name || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
            <dl className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Assigned to</dt>
                <dd>{lead.assignedTo?.name || 'Unassigned'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Email</dt>
                <dd>{lead.assignedTo?.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium">Created</dt>
                <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
        {interactions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">No activity recorded yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {interactions.map((interaction) => (
              <div key={interaction._id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">{interaction.summary}</p>
                  <span className="text-sm text-gray-500">{new Date(interaction.timestamp).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {interaction.type} • {interaction.direction || 'activity'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  By {interaction.performedBy?.name || 'System'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
