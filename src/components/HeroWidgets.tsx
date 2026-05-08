import { Users, Handshake, TrendingUp, DollarSign } from 'lucide-react';

interface HeroWidgetsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    converted: number;
  };
}

export default function HeroWidgets({ stats }: HeroWidgetsProps) {
  const widgets = [
    {
      title: 'Total Leads',
      value: stats.total,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Negotiations',
      value: stats.contacted,
      change: '+8.2%',
      icon: Handshake,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Conversion Rate',
      value: `${Math.round((stats.converted / stats.total) * 100) || 0}%`,
      change: '+5.1%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      isProgress: true,
      progressValue: (stats.converted / stats.total) * 100 || 0,
    },
    {
      title: 'Potential Revenue',
      value: `$${(stats.converted * 2500).toLocaleString()}`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {widgets.map((widget, index) => {
        const Icon = widget.icon;
        return (
          <div
            key={index}
            className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#5fccb1]/10 transition-all duration-300 hover:border-[#5fccb1]/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${widget.bgColor}`}>
                <Icon className={`w-6 h-6 ${widget.color}`} />
              </div>
              <span className="text-green-400 text-sm font-medium">{widget.change}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-gray-400 text-sm font-medium">{widget.title}</h3>
              <p className="text-2xl font-bold text-white">{widget.value}</p>

              {widget.isProgress && (
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#5fccb1] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${widget.progressValue}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="relative w-16 h-8">
                      <svg className="w-16 h-8" viewBox="0 0 64 32">
                        <path
                          d="M 0 32 A 32 32 0 0 1 64 32"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="4"
                        />
                        <path
                          d={`M 0 32 A 32 32 0 0 1 ${32 + 32 * Math.cos((widget.progressValue / 100) * Math.PI)} ${32 - 32 * Math.sin((widget.progressValue / 100) * Math.PI)}`}
                          fill="none"
                          stroke="#5fccb1"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}