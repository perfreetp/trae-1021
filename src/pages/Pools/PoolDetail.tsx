import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Droplets,
  Thermometer,
  Gauge,
  Beaker,
  Fish,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  User,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { pools } from '../../data/pools';
import { batches } from '../../data/batches';

const statusConfig = {
  normal: { label: '正常', color: 'bg-secondary-500', badge: 'badge-success' },
  warning: { label: '预警', color: 'bg-accent-500', badge: 'badge-warning' },
  alarm: { label: '告警', color: 'bg-red-500', badge: 'badge-danger' },
  maintenance: { label: '维护中', color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700' },
};

const operationRecords = [
  { id: 1, type: '投喂', time: '2026-06-05 08:30', operator: '张三', detail: '投喂配合饲料 15kg' },
  { id: 2, type: '巡检', time: '2026-06-05 06:00', operator: '李四', detail: '水质检测正常，设备运行良好' },
  { id: 3, type: '换水', time: '2026-06-04 14:00', operator: '王五', detail: '换水量 30m³' },
  { id: 4, type: '投喂', time: '2026-06-04 08:30', operator: '张三', detail: '投喂配合饲料 14.5kg' },
  { id: 5, type: '消毒', time: '2026-06-03 10:00', operator: '赵六', detail: '聚维酮碘消毒' },
];

export default function PoolDetail() {
  const { poolId } = useParams<{ poolId: string }>();
  const pool = pools.find((p) => p.id === poolId);
  const batch = batches.find((b) => b.poolId === poolId);

  if (!pool) {
    return (
      <div className="text-center py-12">
        <Droplets className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">养殖池不存在</h2>
        <Link to="/pools" className="text-primary-600 hover:text-primary-700 mt-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>
    );
  }

  const status = statusConfig[pool.status];

  const waterQualityData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    水温: 25.5 + Math.sin(i / 6) * 1.2 + (Math.random() - 0.5) * 0.3,
    溶氧: 6.5 + Math.sin(i / 4) * 0.8 + (Math.random() - 0.5) * 0.2,
    pH: 7.1 + Math.sin(i / 8) * 0.2 + (Math.random() - 0.5) * 0.1,
    氨氮: 0.15 + Math.sin(i / 5) * 0.05 + (Math.random() - 0.5) * 0.02,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pools" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">养殖池 {pool.poolNo}</h1>
          <p className="text-sm text-slate-500 mt-1">实时监控与详情</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">池号</span>
              <span className="font-medium text-slate-800">{pool.poolNo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">面积</span>
              <span className="font-medium text-slate-800">{pool.area} m²</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">体积</span>
              <span className="font-medium text-slate-800">{pool.volume} m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">运行状态</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                <span className={`badge ${status.badge}`}>{status.label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">实时水质</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-accent-600" />
                <span className="text-xs text-accent-700">水温</span>
              </div>
              <p className="text-xl font-bold text-accent-700">{pool.temperature}°C</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700">溶氧</span>
              </div>
              <p className="text-xl font-bold text-blue-700">{pool.dissolvedOxygen} mg/L</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">pH</span>
              </div>
              <p className="text-xl font-bold text-green-700">{pool.ph}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Beaker className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-700">氨氮</span>
              </div>
              <p className="text-xl font-bold text-purple-700">0.12 mg/L</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">当前批次</h3>
          {batch ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Fish className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{batch.species}</p>
                  <p className="text-xs text-slate-500">{batch.batchNo}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">数量</span>
                  <span className="font-medium text-slate-700">{batch.currentCount.toLocaleString()} 尾</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 投苗日期
                  </span>
                  <span className="font-medium text-slate-700">{batch.stockDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 预计出池
                  </span>
                  <span className="font-medium text-slate-700">{batch.expectedHarvestDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 成活率
                  </span>
                  <span className="font-medium text-secondary-600">{batch.survivalRate}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Fish className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">暂无养殖批次</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">24小时水质趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterQualityData}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="水温" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="溶氧" stroke="#0EA5E9" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="氨氮" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">近期操作记录</h3>
        <div className="space-y-3">
          {operationRecords.map((record) => (
            <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-800">{record.type}</p>
                  <span className="text-xs text-slate-500 flex-shrink-0">{record.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{record.detail}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {record.operator}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
