import { useState } from 'react';
import { api } from '../lib/api';
import { X } from 'lucide-react';

interface AddLeadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLeadModal({ onClose, onSuccess }: AddLeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new' as 'new' | 'contacted' | 'converted' | 'lost',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await api.createLead(formData);
      if (error) throw new Error(error);
      onSuccess();
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#161b22] rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-[#161b22] border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Add New Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source *
            </label>
            <select
              required
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
              <option value="email">Email Campaign</option>
              <option value="phone">Phone Call</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'new' | 'contacted' | 'converted' | 'lost' })}
              className="w-full px-4 py-2 bg-[#0B0C10] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#5fccb1] focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#5fccb1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#5fccb1]/90 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
