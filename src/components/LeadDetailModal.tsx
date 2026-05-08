import { useState, useEffect } from 'react';
import { api, Lead, LeadNote } from '../lib/api';
import { X, Mail, Phone, Building2, Calendar, Save, MessageSquare, CreditCard as Edit2, Trash2 } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

export default function LeadDetailModal({ lead, onClose, onUpdate }: LeadDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source,
    status: lead.status,
  });

  useEffect(() => {
    fetchNotes();
  }, [lead.id]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await api.getLeadNotes(lead.id);
      if (error) throw new Error(error);
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await api.updateLead(lead.id, formData);
      if (error) throw new Error(error);
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const noteData = {
        note: newNote,
        ...(followUpDate && { followUpDate }),
      };
      const { error } = await api.addLeadNote(lead.id, noteData);
      if (error) throw new Error(error);
      setNewNote('');
      setFollowUpDate('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Delete this note?')) return;

    try {
      const { error } = await api.deleteLeadNote(lead.id, noteId);
      if (error) throw new Error(error);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const statusColors = {
    new: 'bg-blue-500/20 text-blue-400',
    contacted: 'bg-yellow-500/20 text-yellow-400',
    converted: 'bg-green-500/20 text-green-400',
    lost: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#161b22] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-[#161b22] border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Lead Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-2xl font-bold text-white border-b-2 border-[#5fccb1] focus:outline-none w-full bg-transparent"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">{lead.name}</h3>
              )}
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="ml-4 p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 px-3 py-1 bg-[#0B0C10] border border-gray-700 rounded text-white focus:ring-2 focus:ring-[#5fccb1]"
                />
              ) : (
                <span className="text-gray-300">{lead.email}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 px-3 py-1 bg-[#0B0C10] border border-gray-700 rounded text-white focus:ring-2 focus:ring-[#5fccb1]"
                  placeholder="Phone number"
                />
              ) : (
                <span className="text-gray-300">{lead.phone || 'No phone'}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              {editing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="flex-1 px-3 py-1 bg-[#0B0C10] border border-gray-700 rounded text-white focus:ring-2 focus:ring-[#5fccb1]"
                  placeholder="Company name"
                />
              ) : (
                <span className="text-gray-300">{lead.company || 'No company'}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">
                Added {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              {editing ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'new' | 'contacted' | 'converted' | 'lost' })}
                  className="w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              ) : (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status]}`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
              {editing ? (
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1]"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email Campaign</option>
                  <option value="phone">Phone Call</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <span className="text-gray-300 capitalize">{lead.source}</span>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#5fccb1] text-[#0B0C10] rounded-lg hover:bg-[#5fccb1]/90 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#5fccb1]" />
              <h4 className="text-lg font-semibold text-white">Notes & Follow-ups</h4>
            </div>

            <div className="space-y-3 mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note or follow-up..."
                className="w-full px-4 py-3 bg-[#0B0C10] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <input
                  type="datetime-local"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1]"
                  placeholder="Follow-up date (optional)"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-6 py-2 bg-[#5fccb1] text-[#0B0C10] rounded-lg hover:bg-[#5fccb1]/90 transition disabled:opacity-50 font-medium"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="bg-[#0B0C10] border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-gray-300 flex-1">{note.note}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="ml-2 p-1 text-red-400 hover:bg-red-500/20 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                    {note.followUpDate && (
                      <span className="flex items-center gap-1 text-[#5fccb1] font-medium">
                        <Calendar className="w-3 h-3" />
                        Follow-up: {new Date(note.followUpDate).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
