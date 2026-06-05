import { Link } from 'react-router-dom';
import {
  Thermometer,
  Droplets,
  Gauge,
  Fish,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { pools } from '../../data/pools';
import { batches } from '../../data/batches';
import { alerts } from '../../data/alerts';
import { dailyReports } from '../../data/devices';

const statusColors = {
  normal: 'bg-secondary-500',
  warning: 'bg-accent-500',
  alarm: 'bg-red-500',
  maintenance: 'bg-slate-400',
};

const statusBgColors = {
  normal: 'bg-secondary-50 border-secondary-200 hover:bg-secondary-100',
  warning: 'bg-accent-50 border-accent-200 hover:bg-accent-100',
  alarm: 'bg-red-50 border-red-200 hover:bg-red-100',
  maintenance: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
};

export default function Dashboard() {
  const totalPools = pools.filter((p) => p.status !== 'maintenance').length;
  const normalPools = pools.filter((p) => p.status === 'normal').length;
  const warningPools = pools.filter((p) => p.status === 'warning' || p.status === 'alarm').length;
  const totalFish = batches.reduce((sum, b) => sum + b.currentCount, 0);
  const totalWeight = batches.reduce((sum, b) => sum + b.currentCount * b.currentWeight, 0);
  const avgSurvival = (
    batches.reduce((sum, b) => sum + b.survivalRate, 0) / batches.length
  ).toFixed(1);

  const chartData = dailyReports.slice(-7).map((r) => ({
    date: r.date.slice(5),
    投喂量: r.totalFeedAmount,
    用电量: r.electricityUsage / 10,
    死亡率: r.totalDeathCount,
  }));

  const waterQualityData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    溶氧: 6.5 + Math.sin(i / 4) * 0.8 + Math.random() * 0.3,
    水温: 25.5 + Math.sin(i / 6) * 1.2,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{totalPools}</p>
              <p className="stat-label">养殖池数</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-secondary-600 font-medium">{normalPools} 正常</span>
            <span className="text-slate-400">|</span>
            <span className="text-accent-600 font-medium">{warningPools} 告警</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{(totalFish / 10000).toFixed(1)}万</p>
              <p className="stat-label">存鱼总量</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Fish className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-secondary-600">
            <TrendingUp className="w-3 h-3" />
            <span>预计{totalWeight.toFixed(0)}kg可售</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{avgSurvival}%</p>
              <p className="stat-label">平均成活率</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>较上周+0.5%</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">26.0°C</p>
              <p className="stat-label">平均水温</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-accent-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">6.8mg/L</p>
              <p className="stat-label">平均溶氧</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gauge className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">523kWh</p>
              <p className="stat-label">今日用电</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-red-500">
            <TrendingUp className="w-3 h-3" />
            <span>较昨日+5.2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pool Grid */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">车间看板</h3>
              <Link to="/pools" className="text-sm text-primary-600 hover:text-primary-700">
                查看全部 →
              </Link>
            </div>

            {/* A区 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-600 mb-2">A 区（50m³池）</h4>
              <div className="grid grid-cols-6 gap-2">
                {pools.slice(0, 6).map((pool) => (
                  <Link
                    key={pool.id}
                    to={`/pool/${pool.id}`}
                    className={`aspect-square rounded-lg border-2 p-2 transition-all ${
                      statusBgColors[pool.status]
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{pool.poolNo}</span>
                      <span className={`w-2 h-2 rounded-full ${statusColors[pool.status]}`}></span>
                    </div>
                    {pool.status !== 'maintenance' ? (
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-600">{pool.temperature}°C</p>
                        <p className="text-slate-600">{pool.dissolvedOxygen}DO</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">维护中</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* B区 */}
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">B 区（80m³池）</h4>
              <div className="grid grid-cols-6 gap-2">
                {pools.slice(6, 12).map((pool) => (
                  <Link
                    key={pool.id}
                    to={`/pool/${pool.id}`}
                    className={`aspect-square rounded-lg border-2 p-2 transition-all ${
                      statusBgColors[pool.status]
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{pool.poolNo}</span>
                      <span className={`w-2 h-2 rounded-full ${statusColors[pool.status]}`}></span>
                    </div>
                    {pool.status !== 'maintenance' ? (
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-600">{pool.temperature}°C</p>
                        <p className="text-slate-600">{pool.dissolvedOxygen}DO</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">维护中</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
                <span className="text-xs text-slate-600">正常</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-500"></span>
                <span className="text-xs text-slate-600">预警</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-xs text-slate-600">告警</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span className="text-xs text-slate-600">维护</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">实时告警</h3>
              <span className="badge badge-danger">
                {alerts.filter((a) => !a.resolved).length} 未处理
              </span>
            </div>
            <div className="space-y-3">
              {alerts
                .filter((a) => !a.resolved)
                .slice(0, 5)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        alert.level === 'danger'
                          ? 'bg-red-100'
                          : alert.level === 'warning'
                          ? 'bg-accent-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          alert.level === 'danger'
                            ? 'text-red-600'
                            : alert.level === 'warning'
                            ? 'text-accent-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {alert.poolNo} - {alert.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">批次概览</h3>
            <div className="space-y-3">
              {batches.slice(0, 4).map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{batch.species}</p>
                    <p className="text-xs text-slate-500">{batch.batchNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {batch.currentWeight}kg
                    </p>
                    <p className="text-xs text-secondary-600">{batch.survivalRate}% 成活</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">近7天生产趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="投喂量"
                  stroke="#0D9488"
                  fill="url(#colorFeed)"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="用电量" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">24小时水质趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterQualityData}>
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="溶氧"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="水温"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
