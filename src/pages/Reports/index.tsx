import { useState } from 'react';
import {
  FileText,
  Users,
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { dailyReports, staffPerformances } from '../../data/devices';

type TabType = 'daily' | 'performance' | 'analysis';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [selectedDate, setSelectedDate] = useState('');

  const tabs = [
    { id: 'daily' as TabType, label: '生产日报', icon: FileText },
    { id: 'performance' as TabType, label: '人员绩效', icon: Users },
    { id: 'analysis' as TabType, label: '统计分析', icon: BarChart3 },
  ];

  const handleExport = () => {
    const headers = ['日期', '投喂总量(kg)', '死亡数', '平均水温(°C)', '平均溶氧(mg/L)', '任务完成率(%)', '用电量(kWh)', '用水量(t)'];
    const rows = dailyReports.map(r => [
      r.date,
      r.totalFeedAmount,
      r.totalDeathCount,
      r.avgTemperature,
      r.avgDissolvedOxygen,
      r.taskCompletionRate,
      r.electricityUsage,
      r.waterUsage,
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `生产日报_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const performanceChartData = staffPerformances.map(sp => ({
    name: sp.name,
    完成任务数: sp.tasksCompleted,
    任务总数: sp.tasksTotal,
    投喂量: sp.feedAmount / 100,
    抽样数: sp.samplingCount,
  }));

  const analysisChartData = dailyReports.map(r => ({
    date: r.date.slice(5),
    投喂量: r.totalFeedAmount,
    水温: r.avgTemperature,
    溶氧: r.avgDissolvedOxygen * 10,
    完成率: r.taskCompletionRate,
    用电量: r.electricityUsage / 5,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">报表中心</h1>
          <p className="text-sm text-slate-500 mt-1">查看生产数据、人员绩效和统计分析</p>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'daily' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">生产日报</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field text-sm w-40"
                />
              </div>
              <button onClick={handleExport} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell text-left">日期</th>
                  <th className="table-cell text-right">投喂总量(kg)</th>
                  <th className="table-cell text-right">死亡数</th>
                  <th className="table-cell text-right">平均水温(°C)</th>
                  <th className="table-cell text-right">平均溶氧(mg/L)</th>
                  <th className="table-cell text-right">任务完成率</th>
                  <th className="table-cell text-right">用电量(kWh)</th>
                  <th className="table-cell text-right">用水量(t)</th>
                </tr>
              </thead>
              <tbody>
                {dailyReports.map((report, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell font-medium">{report.date}</td>
                    <td className="table-cell text-right">{report.totalFeedAmount}</td>
                    <td className="table-cell text-right text-red-600">{report.totalDeathCount}</td>
                    <td className="table-cell text-right">{report.avgTemperature}</td>
                    <td className="table-cell text-right">{report.avgDissolvedOxygen}</td>
                    <td className="table-cell text-right">
                      <span className={`font-medium ${report.taskCompletionRate >= 90 ? 'text-secondary-600' : 'text-accent-600'}`}>
                        {report.taskCompletionRate}%
                      </span>
                    </td>
                    <td className="table-cell text-right">{report.electricityUsage}</td>
                    <td className="table-cell text-right">{report.waterUsage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">人员绩效列表</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell text-left">姓名</th>
                    <th className="table-cell text-left">角色</th>
                    <th className="table-cell text-right">完成/总数</th>
                    <th className="table-cell text-right">完成率</th>
                    <th className="table-cell text-right">投喂量</th>
                    <th className="table-cell text-right">抽样数</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformances.map((sp) => (
                    <tr key={sp.id} className="table-row">
                      <td className="table-cell font-medium">{sp.name}</td>
                      <td className="table-cell">
                        <span className="badge badge-info">{sp.role}</span>
                      </td>
                      <td className="table-cell text-right">{sp.tasksCompleted}/{sp.tasksTotal}</td>
                      <td className="table-cell text-right">
                        <span className={`font-medium ${sp.completionRate >= 95 ? 'text-secondary-600' : sp.completionRate >= 85 ? 'text-accent-600' : 'text-red-600'}`}>
                          {sp.completionRate}%
                        </span>
                      </td>
                      <td className="table-cell text-right">{sp.feedAmount}kg</td>
                      <td className="table-cell text-right">{sp.samplingCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">人员绩效对比</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="完成任务数" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="投喂量" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="抽样数" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">关键指标趋势</h3>
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <TrendingUp className="w-4 h-4" />
              近7天数据
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="投喂量" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="水温" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="溶氧" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="完成率" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="用电量" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
