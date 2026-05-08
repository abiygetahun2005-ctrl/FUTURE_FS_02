import { Lead } from '../lib/api';
import { Mail, Phone, Building2, Calendar } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-yellow-500/20 text-yellow-400',
  converted: 'bg-green-500/20 text-green-400',
  lost: 'bg-gray-500/20 text-gray-400',
};

const sourceIcons: Record<string, string> = {
  website: '🌐',
  referral: '👥',
  social: '📱',
  email: '📧',
  phone: '📞',
  other: '📋',
};

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#161b22] border border-gray-700 rounded-2xl p-5 hover:shadow-lg hover:shadow-[#5fccb1]/10 transition-all duration-300 hover:border-[#5fccb1]/30 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{lead.name}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>
        <span className="text-2xl">{sourceIcons[lead.source.toLowerCase()] || '📋'}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Mail className="w-4 h-4" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.company && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>{lead.company}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-700">
          <Calendar className="w-4 h-4" />
          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
