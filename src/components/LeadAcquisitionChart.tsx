import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', leads: 120 },
  { name: 'Feb', leads: 150 },
  { name: 'Mar', leads: 180 },
  { name: 'Apr', leads: 220 },
  { name: 'May', leads: 280 },
  { name: 'Jun', leads: 320 },
  { name: 'Jul', leads: 380 },
  { name: 'Aug', leads: 420 },
  { name: 'Sep', leads: 480 },
  { name: 'Oct', leads: 520 },
  { name: 'Nov', leads: 580 },
  { name: 'Dec', leads: 650 },
];

export default function LeadAcquisitionChart() {
  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#5fccb1]/10 transition-all duration-300 hover:border-[#5fccb1]/30">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Lead Acquisition</h3>
        <p className="text-gray-400 text-sm">Monthly lead growth over the past year</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5fccb1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#5fccb1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#5fccb1"
              strokeWidth={3}
              fill="url(#leadGradient)"
              dot={{ fill: '#5fccb1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#5fccb1', strokeWidth: 2, fill: '#0B0C10' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}