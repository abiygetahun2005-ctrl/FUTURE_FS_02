import { useEffect, useState } from 'react';
import { api, Lead } from '../lib/api';
import HeroWidgets from './HeroWidgets';
import LeadAcquisitionChart from './LeadAcquisitionChart';
import TopLeadsTable from './TopLeadsTable';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';
import LeadDetailModal from './LeadDetailModal';
import { Plus, Filter } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

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

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your lead management overview.</p>
      </div>

      <HeroWidgets stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <LeadAcquisitionChart />
        <TopLeadsTable leads={leads} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#161b22] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent transition"
          >
            <option value="all">All Leads</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#5fccb1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#5fccb1]/90 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fccb1]"></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-[#161b22] border border-gray-700 rounded-2xl">
          <p className="text-gray-400">No leads found. Add your first lead to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchLeads();
          }}
        />
      )}

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
