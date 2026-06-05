import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Fish, TrendingUp, Skull, ClipboardList } from 'lucide-react';
import { samplingRecords, deathRecords } from '../../data/samplings';

const tabs = [
  { id: 'sampling', label: '鱼体抽样', icon: Fish },
  { id: 'growth', label: '生长曲线', icon: TrendingUp },
  { id: 'death', label: '病死鱼登记', icon: Skull },
];

const growthData = [
  { week: '第1周', actual: 0.05, standard: 0.06 },
  { week: '第2周', actual: 0.12, standard: 0.13 },
  { week: '第3周', actual: 0.25, standard: 0.26 },
  { week: '第4周', actual: 0.35, standard: 0.38 },
  { week: '第5周', actual: 0.52, standard: 0.52 },
  { week: '第6周', actual: 0.72, standard: 0.70 },
  { week: '第7周', actual: 0.95, standard: 0.92 },
  { week: '第8周', actual: 1.2, standard: 1.18 },
];

export default function Quality() {
  const [activeTab, setActiveTab] = useState('sampling');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">质量检测管理</h1>
          <p className="text-sm text-slate-500 mt-1">鱼体抽样检测、生长趋势分析、病死鱼登记管理</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          新增记录
        </button>
      </div>

      <div className="card">
        <div className="flex border-b border-slate-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'sampling' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell text-left">批次号</th>
                    <th className="table-cell text-left">抽样日期</th>
                    <th className="table-cell text-left">样本数</th>
                    <th className="table-cell text-left">平均体重</th>
                    <th className="table-cell text-left">平均体长</th>
                    <th className="table-cell text-left">质检员</th>
                    <th className="table-cell text-left">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {samplingRecords.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-cell font-medium text-primary-600">{record.batchNo}</td>
                      <td className="table-cell">{record.sampleDate}</td>
                      <td className="table-cell">{record.sampleCount} 尾</td>
                      <td className="table-cell">{record.avgWeight} kg</td>
                      <td className="table-cell">{record.avgLength} cm</td>
                      <td className="table-cell">{record.inspectorName}</td>
                      <td className="table-cell text-slate-500 max-w-xs truncate">{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">生长趋势对比</h3>
                <p className="text-sm text-slate-500 mt-1">批次 B20260501 生长曲线与标准曲线对比</p>
              </div>
              <select className="input-field w-48">
                <option>B20260501</option>
                <option>B20260415</option>
                <option>B20260320</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="kg" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="实际生长"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="standard"
                    name="标准曲线"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">0.35 kg</p>
                <p className="text-xs text-slate-500 mt-1">当前平均体重</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-600">102.9%</p>
                <p className="text-xs text-slate-500 mt-1">生长达标率</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-600">预计 12 周</p>
                <p className="text-xs text-slate-500 mt-1">预计出栏周期</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'death' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell text-left">批次号</th>
                    <th className="table-cell text-left">日期</th>
                    <th className="table-cell text-left">死亡数量</th>
                    <th className="table-cell text-left">死因</th>
                    <th className="table-cell text-left">处理方式</th>
                    <th className="table-cell text-left">记录人</th>
                  </tr>
                </thead>
                <tbody>
                  {deathRecords.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-cell font-medium text-primary-600">{record.batchNo}</td>
                      <td className="table-cell">{record.date}</td>
                      <td className="table-cell">
                        <span className="text-red-600 font-medium">{record.count} 尾</span>
                      </td>
                      <td className="table-cell">
                        <span className="badge badge-warning">{record.cause}</span>
                      </td>
                      <td className="table-cell text-slate-600">{record.disposalMethod}</td>
                      <td className="table-cell">{record.recorderName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
