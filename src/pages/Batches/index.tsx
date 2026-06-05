import { useState } from 'react';
import {
  Fish,
  Clock,
  CalendarDays,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronRight,
  Scale,
  CheckCircle,
  Baby,
  FishSymbol,
  Package,
  Activity,
  FileText,
} from 'lucide-react';
import { batches } from '../../data/batches';
import { useAppStore } from '../../store';
import type { Batch } from '../../types';

const stageConfig = {
  fry: { label: '鱼苗', color: 'bg-cyan-500', bg: 'bg-cyan-50 text-cyan-700' },
  juvenile: { label: '幼鱼', color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  adult: { label: '成鱼', color: 'bg-secondary-500', bg: 'bg-secondary-50 text-secondary-700' },
  ready: { label: '待出池', color: 'bg-accent-500', bg: 'bg-accent-50 text-accent-700' },
};

const stageFilters = [
  { value: 'all', label: '全部' },
  { value: 'fry', label: '鱼苗' },
  { value: 'juvenile', label: '幼鱼' },
  { value: 'adult', label: '成鱼' },
  { value: 'ready', label: '待出池' },
];

export default function Batches() {
  const { samplingRecords } = useAppStore();
  const [filterStage, setFilterStage] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentMonthStr = `${currentYear}-${currentMonth}`;
  const monthLabel = `${currentYear}年${currentMonth}月`;

  const ongoingCount = batches.filter((b) => b.stage !== 'ready').length;
  const readyCount = batches.filter((b) => b.stage === 'ready').length;
  const monthlyStock = batches.filter((b) => b.stockDate.startsWith(currentMonthStr)).length;
  const monthlyHarvest = batches.filter((b) => b.expectedHarvestDate.startsWith(currentMonthStr)).length;

  const filteredBatches = batches.filter((batch) => {
    return filterStage === 'all' || batch.stage === filterStage;
  });

  const getSamplingsByBatchId = (batchId: string) => {
    return samplingRecords.filter((s) => s.batchId === batchId);
  };

  const generateMilestones = (batch: Batch) => {
    const stockDate = new Date(batch.stockDate);
    return [
      { title: '投苗', date: batch.stockDate, icon: Baby, completed: true },
      {
        title: '首次投喂',
        date: new Date(stockDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        icon: Fish,
        completed: true,
      },
      {
        title: '第一次抽样',
        date: new Date(stockDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        icon: Activity,
        completed: true,
      },
      {
        title: '分级转池',
        date: new Date(stockDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        icon: Package,
        completed: batch.stage !== 'fry',
      },
      {
        title: '预计出池',
        date: batch.expectedHarvestDate,
        icon: CheckCircle,
        completed: batch.stage === 'ready',
      },
    ];
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">批次追踪管理</h1>
          <p className="text-sm text-slate-500 mt-1">查看和管理所有养殖批次</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{ongoingCount}</p>
              <p className="stat-label">进行中批次</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FishSymbol className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-primary-600">
            <TrendingUp className="w-3 h-3" />
            <span>较上月+2</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{readyCount}</p>
              <p className="stat-label">待出池批次</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-accent-600">
            <Clock className="w-3 h-3" />
            <span>预计本月出池</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{monthlyStock}</p>
              <p className="stat-label">本月投苗批次</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Baby className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-secondary-600">
            <CalendarDays className="w-3 h-3" />
            <span>{monthLabel}</span>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{monthlyHarvest}</p>
              <p className="stat-label">本月出池批次</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <CalendarDays className="w-3 h-3" />
            <span>{monthLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-slate-500" />
        <div className="flex flex-wrap gap-2">
          {stageFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStage(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStage === filter.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell text-left"></th>
                <th className="table-cell text-left">批次号</th>
                <th className="table-cell text-left">品种</th>
                <th className="table-cell text-left">数量</th>
                <th className="table-cell text-left">当前规格</th>
                <th className="table-cell text-left">投苗日期</th>
                <th className="table-cell text-left">预计出池</th>
                <th className="table-cell text-left">成活率</th>
                <th className="table-cell text-left">生长阶段</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => {
                const stage = stageConfig[batch.stage];
                const isExpanded = expandedId === batch.id;
                const samplings = getSamplingsByBatchId(batch.id);
                const milestones = generateMilestones(batch);

                return (
                  <>
                    <tr
                      key={batch.id}
                      className="table-row cursor-pointer"
                      onClick={() => toggleExpand(batch.id)}
                    >
                      <td className="table-cell">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </td>
                      <td className="table-cell">
                        <span className="font-semibold text-slate-800">{batch.batchNo}</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Fish className="w-4 h-4 text-primary-600" />
                          </div>
                          <span className="font-medium text-slate-700">{batch.species}</span>
                        </div>
                      </td>
                      <td className="table-cell">{batch.currentCount.toLocaleString()} 尾</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <Scale className="w-4 h-4 text-slate-400" />
                          <span>{batch.currentWeight} kg/尾</span>
                        </div>
                      </td>
                      <td className="table-cell">{batch.stockDate}</td>
                      <td className="table-cell">{batch.expectedHarvestDate}</td>
                      <td className="table-cell">
                        <span
                          className={`font-semibold ${
                            batch.survivalRate >= 95 ? 'text-green-600' : 'text-accent-600'
                          }`}
                        >
                          {batch.survivalRate}%
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${stage.bg}`}>{stage.label}</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="bg-slate-50">
                          <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary-600" />
                                  基本信息
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-slate-500">养殖池</p>
                                    <p className="font-medium text-slate-800">{batch.poolId}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500">初始数量</p>
                                    <p className="font-medium text-slate-800">
                                      {batch.initialCount.toLocaleString()} 尾
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500">初始规格</p>
                                    <p className="font-medium text-slate-800">
                                      {batch.initialWeight} kg/尾
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500">当前总量</p>
                                    <p className="font-medium text-slate-800">
                                      {(batch.currentCount * batch.currentWeight).toFixed(0)} kg
                                    </p>
                                  </div>
                                </div>

                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 pt-2">
                                  <Activity className="w-4 h-4 text-secondary-600" />
                                  抽样记录
                                </h4>
                                <div className="space-y-2">
                                  {samplings.length > 0 ? (
                                    samplings.map((s) => (
                                      <div
                                        key={s.id}
                                        className="bg-white rounded-lg p-3 border border-slate-200"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-sm font-medium text-slate-800">
                                            {s.sampleDate}
                                          </span>
                                          <span className="text-xs text-slate-500">
                                            {s.inspectorName}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                          <span>抽样: {s.sampleCount}尾</span>
                                          <span>均重: {s.avgWeight}kg</span>
                                          <span>均长: {s.avgLength}cm</span>
                                        </div>
                                        {s.notes && (
                                          <p className="text-xs text-slate-500 mt-1">{s.notes}</p>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-slate-400">暂无抽样记录</p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                                  <TrendingUp className="w-4 h-4 text-accent-600" />
                                  生长里程碑
                                </h4>
                                <div className="relative">
                                  {milestones.map((milestone, index) => {
                                    const Icon = milestone.icon;
                                    return (
                                      <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                                        <div className="relative">
                                          <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                              milestone.completed
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-slate-200 text-slate-400'
                                            }`}
                                          >
                                            <Icon className="w-5 h-5" />
                                          </div>
                                          {index < milestones.length - 1 && (
                                            <div
                                              className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 ${
                                                milestone.completed ? 'bg-primary-600' : 'bg-slate-200'
                                              }`}
                                            ></div>
                                          )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                          <p
                                            className={`text-sm font-medium ${
                                              milestone.completed ? 'text-slate-800' : 'text-slate-400'
                                            }`}
                                          >
                                            {milestone.title}
                                          </p>
                                          <p className="text-xs text-slate-500">{milestone.date}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBatches.length === 0 && (
          <div className="py-12 text-center">
            <Fish className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">没有找到符合条件的批次</p>
          </div>
        )}
      </div>
    </div>
  );
}
