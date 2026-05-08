import { useEffect, useState } from 'react';
import { api, Lead } from '../lib/api';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';
import LeadDetailModal from './LeadDetailModal';
import { Plus, Search, Filter } from 'lucide-react';

export default function Contacts() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

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
        <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
        <p className="text-gray-400">Manage all your leads and contacts in one place.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6">
          <div className="text-sm font-medium text-gray-400 mb-1">Total Contacts</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6">
          <div className="text-sm font-medium text-gray-400 mb-1">New Leads</div>
          <div className="text-3xl font-bold text-blue-400">{stats.new}</div>
        </div>
        <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6">
          <div className="text-sm font-medium text-gray-400 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.contacted}</div>
        </div>
        <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6">
          <div className="text-sm font-medium text-gray-400 mb-1">Converted</div>
          <div className="text-3xl font-bold text-green-400">{stats.converted}</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#161b22] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#5fccb1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#5fccb1]/90 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fccb1]"></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-[#161b22] border border-gray-700 rounded-2xl">
          <p className="text-gray-400">
            {searchTerm ? 'No contacts found matching your search.' : 'No contacts yet. Add your first contact to get started!'}
          </p>
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