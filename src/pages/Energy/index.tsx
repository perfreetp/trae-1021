import { useState } from 'react';
import {
  Zap,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Cpu,
  Play,
  Square,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { devices, energyRecords } from '../../data/devices';
import { pools } from '../../data/pools';

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];
const deviceTypeNames: Record<string, string> = { pump: '水泵', aerator: '增氧机', filter: '过滤系统', heater: '温控系统', sensor: '传感器' };
const statusConfig = {
  running: { label: '运行中', color: 'bg-green-100 text-green-700', icon: Play },
  stopped: { label: '已停止', color: 'bg-slate-100 text-slate-600', icon: Square },
  fault: { label: '故障', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  maintenance: { label: '维护中', color: 'bg-amber-100 text-amber-700', icon: Wrench },
};

const tooltipStyle = { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' };

export default function Energy() {
  const [activeTab, setActiveTab] = useState<'stats' | 'oxygen' | 'devices'>('stats');
  const today = energyRecords[energyRecords.length - 1];
  const yesterday = energyRecords[energyRecords.length - 2];

  const getTrend = (current: number, previous: number) => {
    const diff = ((current - previous) / previous) * 100;
    return { value: diff.toFixed(1), isUp: diff >= 0 };
  };

  const barData = energyRecords.slice(-30).map((r) => ({ date: r.date.slice(5), 用电量: r.electricityUsage, 用水量: r.waterUsage }));
  const deviceEnergyData = [{ name: '循环水泵', value: 35 }, { name: '增氧机', value: 28 }, { name: '过滤系统', value: 18 }, { name: '温控系统', value: 12 }, { name: '其他', value: 7 }];
  const oxygenTrendData = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, A01: 6.5 + Math.sin(i / 4) * 0.8, B01: 6.2 + Math.sin(i / 5) * 0.6, A02: 6.8 + Math.sin(i / 4.5) * 0.7 }));
  const tabs = [{ key: 'stats', label: '能耗统计', icon: BarChart3 }, { key: 'oxygen', label: '氧气管理', icon: Wind }, { key: 'devices', label: '设备状态', icon: Cpu }];

  const StatCard = ({ icon: Icon, label, value, unit, trend, color }: any) => (
    <div className="stat-card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-value">{value} {unit}</p>
          <p className="stat-label">{label}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        {trend.isUp ? <TrendingUp className="w-3 h-3 text-red-500" /> : <TrendingDown className="w-3 h-3 text-green-500" />}
        <span className={trend.isUp ? 'text-red-500' : 'text-green-500'}>{trend.isUp ? '+' : ''}{trend.value}%</span>
        <span className="text-slate-400 ml-1">较昨日</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Zap} label="今日用电量" value={today.electricityUsage} unit="kWh" trend={getTrend(today.electricityUsage, yesterday.electricityUsage)} color="bg-primary-100" />
        <StatCard icon={Droplets} label="今日用水量" value={today.waterUsage} unit="m³" trend={getTrend(today.waterUsage, yesterday.waterUsage)} color="bg-secondary-100" />
        <StatCard icon={Wind} label="今日耗氧量" value={today.oxygenUsage} unit="kg" trend={getTrend(today.oxygenUsage, yesterday.oxygenUsage)} color="bg-accent-100" />
      </div>

      <div className="card">
        <div className="flex gap-2 border-b border-slate-100 pb-4 mb-6">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:bg-slate-50'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4">近30天能耗趋势</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" interval={4} />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="用电量" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="用水量" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4">设备能耗占比</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceEnergyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {deviceEnergyData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '占比']} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oxygen' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4">各池溶氧状态</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {pools.slice(0, 6).map((pool) => (
                  <div key={pool.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">{pool.poolNo}</span>
                      <span className={`w-2 h-2 rounded-full ${pool.dissolvedOxygen >= 6 ? 'bg-green-500' : pool.dissolvedOxygen >= 5 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    </div>
                    <p className="text-lg font-bold text-slate-800">{pool.dissolvedOxygen.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-1">mg/L</span></p>
                    <p className="text-xs text-slate-500 mt-1">水温 {pool.temperature}°C</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-4">24小时溶氧趋势</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oxygenTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" interval={3} />
                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[5, 8]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="A01" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="B01" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="A02" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">设备状态列表</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">设备名称</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">类型</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">状态</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">运行时长</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">上次维护</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => {
                    const config = statusConfig[device.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr key={device.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center"><Activity className="w-4 h-4 text-primary-600" /></div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{device.name}</p>
                              {device.poolNo && <p className="text-xs text-slate-500">{device.poolNo}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{deviceTypeNames[device.type]}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}><StatusIcon className="w-3 h-3" />{config.label}</span></td>
                        <td className="py-3 px-4 text-sm text-slate-600">{device.runHours} h</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{device.lastMaintenance}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
