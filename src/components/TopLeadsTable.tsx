import { Lead } from '../lib/api';

interface TopLeadsTableProps {
  leads: Lead[];
}

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-yellow-500/20 text-yellow-400',
  converted: 'bg-green-500/20 text-green-400',
  lost: 'bg-gray-500/20 text-gray-400',
};

const sourceColors = {
  website: 'bg-purple-500/20 text-purple-400',
  referral: 'bg-indigo-500/20 text-indigo-400',
  social: 'bg-pink-500/20 text-pink-400',
  email: 'bg-cyan-500/20 text-cyan-400',
  phone: 'bg-orange-500/20 text-orange-400',
  other: 'bg-gray-500/20 text-gray-400',
};

export default function TopLeadsTable({ leads }: TopLeadsTableProps) {
  // Sort leads by some criteria (for demo, using converted status as "top")
  const topLeads = leads
    .sort((a, b) => {
      const scoreA = a.status === 'converted' ? 100 : a.status === 'contacted' ? 50 : 25;
      const scoreB = b.status === 'converted' ? 100 : b.status === 'contacted' ? 50 : 25;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#5fccb1]/10 transition-all duration-300 hover:border-[#5fccb1]/30">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Top Leads</h3>
        <p className="text-gray-400 text-sm">Highest potential leads based on engagement</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Source</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Score</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {topLeads.map((lead) => {
              const score = lead.status === 'converted' ? 95 : lead.status === 'contacted' ? 75 : 45;
              return (
                <tr
                  key={lead.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#5fccb1] rounded-full flex items-center justify-center text-[#0B0C10] font-bold text-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      sourceColors[lead.source.toLowerCase() as keyof typeof sourceColors] || sourceColors.other
                    }`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#5fccb1] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-medium w-8">{score}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[lead.status]
                    }`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}