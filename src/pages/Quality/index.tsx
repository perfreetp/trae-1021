import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Fish, TrendingUp, Skull, ClipboardList, Plus, X } from 'lucide-react';
import { useAppStore } from '../../store';
import { batches } from '../../data/batches';
import type { SamplingRecord, DeathRecord } from '../../types';

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

const inspectorOptions = ['李质检', '王质检', '张饲养', '刘饲养'];
const causeOptions = ['正常死亡', '高温应激', '细菌性感染', '寄生虫', '相互残食', '水质问题', '其他'];
const disposalOptions = ['无害化深埋处理', '焚烧处理', '专业机构回收'];

export default function Quality() {
  const { samplingRecords, deathRecords, addSamplingRecord, addDeathRecord } = useAppStore();
  const [activeTab, setActiveTab] = useState('sampling');
  const [showSamplingModal, setShowSamplingModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);

  const [samplingForm, setSamplingForm] = useState<Omit<SamplingRecord, 'id'>>({
    batchId: batches[0].id,
    batchNo: batches[0].batchNo,
    sampleDate: new Date().toISOString().split('T')[0],
    sampleCount: 30,
    avgWeight: 0.5,
    avgLength: 20,
    inspectorName: '李质检',
    notes: '',
  });

  const [deathForm, setDeathForm] = useState<Omit<DeathRecord, 'id'>>({
    batchId: batches[0].id,
    batchNo: batches[0].batchNo,
    date: new Date().toISOString().split('T')[0],
    count: 5,
    cause: '正常死亡',
    disposalMethod: '无害化深埋处理',
    recorderName: '张饲养',
  });

  const handleAddSampling = () => {
    addSamplingRecord(samplingForm);
    setShowSamplingModal(false);
    setSamplingForm({
      batchId: batches[0].id,
      batchNo: batches[0].batchNo,
      sampleDate: new Date().toISOString().split('T')[0],
      sampleCount: 30,
      avgWeight: 0.5,
      avgLength: 20,
      inspectorName: '李质检',
      notes: '',
    });
  };

  const handleAddDeath = () => {
    addDeathRecord(deathForm);
    setShowDeathModal(false);
    setDeathForm({
      batchId: batches[0].id,
      batchNo: batches[0].batchNo,
      date: new Date().toISOString().split('T')[0],
      count: 5,
      cause: '正常死亡',
      disposalMethod: '无害化深埋处理',
      recorderName: '张饲养',
    });
  };

  const handleBatchChange = (batchId: string, formType: 'sampling' | 'death') => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      if (formType === 'sampling') {
        setSamplingForm((prev) => ({ ...prev, batchId, batchNo: batch.batchNo }));
      } else {
        setDeathForm((prev) => ({ ...prev, batchId, batchNo: batch.batchNo }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">质量检测管理</h1>
          <p className="text-sm text-slate-500 mt-1">鱼体抽样检测、生长趋势分析、病死鱼登记管理</p>
        </div>
        {activeTab === 'sampling' && (
          <button
            onClick={() => setShowSamplingModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增抽样记录
          </button>
        )}
        {activeTab === 'death' && (
          <button
            onClick={() => setShowDeathModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增病死记录
          </button>
        )}
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
                {batches.map((b) => (
                  <option key={b.id}>{b.batchNo}</option>
                ))}
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

      {/* 新增抽样记录弹窗 */}
      {showSamplingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">新增鱼体抽样记录</h3>
              <button
                onClick={() => setShowSamplingModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">选择批次</label>
                <select
                  className="input-field"
                  value={samplingForm.batchId}
                  onChange={(e) => handleBatchChange(e.target.value, 'sampling')}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchNo} - {b.species}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">抽样日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={samplingForm.sampleDate}
                    onChange={(e) => setSamplingForm((p) => ({ ...p, sampleDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">样本数 (尾)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={samplingForm.sampleCount}
                    onChange={(e) => setSamplingForm((p) => ({ ...p, sampleCount: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">平均体重 (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={samplingForm.avgWeight}
                    onChange={(e) => setSamplingForm((p) => ({ ...p, avgWeight: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">平均体长 (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={samplingForm.avgLength}
                    onChange={(e) => setSamplingForm((p) => ({ ...p, avgLength: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">质检员</label>
                <select
                  className="input-field"
                  value={samplingForm.inspectorName}
                  onChange={(e) => setSamplingForm((p) => ({ ...p, inspectorName: e.target.value }))}
                >
                  {inspectorOptions.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                <textarea
                  className="input-field resize-none h-20"
                  placeholder="填写检测备注..."
                  value={samplingForm.notes}
                  onChange={(e) => setSamplingForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-100">
              <button
                onClick={() => setShowSamplingModal(false)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button onClick={handleAddSampling} className="flex-1 btn-primary">
                保存记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增病死鱼记录弹窗 */}
      {showDeathModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">新增病死鱼登记</h3>
              <button
                onClick={() => setShowDeathModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">选择批次</label>
                <select
                  className="input-field"
                  value={deathForm.batchId}
                  onChange={(e) => handleBatchChange(e.target.value, 'death')}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchNo} - {b.species}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={deathForm.date}
                    onChange={(e) => setDeathForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">死亡数量 (尾)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={deathForm.count}
                    onChange={(e) => setDeathForm((p) => ({ ...p, count: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">死因</label>
                <select
                  className="input-field"
                  value={deathForm.cause}
                  onChange={(e) => setDeathForm((p) => ({ ...p, cause: e.target.value }))}
                >
                  {causeOptions.map((cause) => (
                    <option key={cause}>{cause}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">处理方式</label>
                <select
                  className="input-field"
                  value={deathForm.disposalMethod}
                  onChange={(e) => setDeathForm((p) => ({ ...p, disposalMethod: e.target.value }))}
                >
                  {disposalOptions.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">记录人</label>
                <select
                  className="input-field"
                  value={deathForm.recorderName}
                  onChange={(e) => setDeathForm((p) => ({ ...p, recorderName: e.target.value }))}
                >
                  {inspectorOptions.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-100">
              <button
                onClick={() => setShowDeathModal(false)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button onClick={handleAddDeath} className="flex-1 btn-primary">
                保存记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
