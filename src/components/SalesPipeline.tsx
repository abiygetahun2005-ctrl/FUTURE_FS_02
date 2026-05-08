import { useEffect, useState } from 'react';
import { api, Lead } from '../lib/api';
import LeadCard from './LeadCard';
import LeadDetailModal from './LeadDetailModal';
import { Plus, MoreHorizontal } from 'lucide-react';

const statusColumns = [
  { id: 'new', title: 'New Leads', color: 'border-blue-500/30', bgColor: 'bg-blue-500/10' },
  { id: 'contacted', title: 'Contacted', color: 'border-yellow-500/30', bgColor: 'bg-yellow-500/10' },
  { id: 'converted', title: 'Converted', color: 'border-green-500/30', bgColor: 'bg-green-500/10' },
  { id: 'lost', title: 'Lost', color: 'border-gray-500/30', bgColor: 'bg-gray-500/10' },
];

export default function SalesPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await api.getLeads();
      if (error) throw new Error(error);
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: Lead['status']) => {
    try {
      const { error } = await api.updateLead(leadId, { status: newStatus });
      if (error) throw new Error(error);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getTotalValue = (leads: Lead[]) => {
    // Assuming each converted lead is worth $2500
    return leads.filter(lead => lead.status === 'converted').length * 2500;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fccb1]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sales Pipeline</h1>
        <p className="text-gray-400">Track your leads through the sales process.</p>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statusColumns.map((column) => {
          const columnLeads = getLeadsByStatus(column.id);
          const totalValue = getTotalValue(columnLeads);
          return (
            <div key={column.id} className={`bg-[#161b22] border ${column.color} rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                <span className="text-2xl font-bold text-white">{columnLeads.length}</span>
              </div>
              {column.id === 'converted' && (
                <div className="text-sm text-gray-400">
                  Value: ${totalValue.toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => {
          const columnLeads = getLeadsByStatus(column.id);
          return (
            <div key={column.id} className={`bg-[#161b22] border ${column.color} rounded-2xl p-6 min-h-[600px]`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{columnLeads.length}</span>
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#0B0C10] border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-[#5fccb1]/50 transition-all duration-200"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{lead.name}</h4>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                      </div>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs bg-transparent border border-gray-600 rounded px-2 py-1 text-gray-300 focus:border-[#5fccb1]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>

                    {lead.company && (
                      <p className="text-gray-500 text-sm mb-2">{lead.company}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{lead.source}</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Progress indicator for contacted leads */}
                    {lead.status === 'contacted' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div className="bg-[#5fccb1] h-1 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">75% complete</p>
                      </div>
                    )}
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No leads in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={fetchLeads}
        />
      )}
    </div>
  );
}