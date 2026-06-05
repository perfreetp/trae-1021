import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  Thermometer,
  Gauge,
  Filter,
  Search,
  ChevronRight,
} from 'lucide-react';
import { pools } from '../../data/pools';
import { batches } from '../../data/batches';
import type { Pool } from '../../types';

const statusConfig = {
  normal: { label: '正常', color: 'bg-secondary-500', badge: 'badge-success' },
  warning: { label: '预警', color: 'bg-accent-500', badge: 'badge-warning' },
  alarm: { label: '告警', color: 'bg-red-500', badge: 'badge-danger' },
  maintenance: { label: '维护中', color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700' },
};

export default function PoolList() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPools = pools.filter((pool) => {
    const matchStatus = filterStatus === 'all' || pool.status === filterStatus;
    const matchSearch = pool.poolNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getBatchByPoolId = (poolId: string) => {
    return batches.find((b) => b.poolId === poolId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">养殖池管理</h1>
          <p className="text-sm text-slate-500 mt-1">查看所有养殖池的实时状态</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索池号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field max-w-[160px]"
          >
            <option value="all">全部状态</option>
            <option value="normal">正常</option>
            <option value="warning">预警</option>
            <option value="alarm">告警</option>
            <option value="maintenance">维护中</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell text-left">池号</th>
                <th className="table-cell text-left">面积</th>
                <th className="table-cell text-left">体积</th>
                <th className="table-cell text-left">状态</th>
                <th className="table-cell text-left">当前批次</th>
                <th className="table-cell text-left">水温</th>
                <th className="table-cell text-left">溶氧</th>
                <th className="table-cell text-left">pH</th>
                <th className="table-cell text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((pool: Pool) => {
                const batch = getBatchByPoolId(pool.id);
                const status = statusConfig[pool.status];
                return (
                  <tr key={pool.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-semibold text-slate-800">{pool.poolNo}</span>
                      </div>
                    </td>
                    <td className="table-cell">{pool.area} m²</td>
                    <td className="table-cell">{pool.volume} m³</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                        <span className={`badge ${status.badge}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {batch ? (
                        <div>
                          <p className="font-medium text-slate-800">{batch.species}</p>
                          <p className="text-xs text-slate-500">{batch.batchNo}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {pool.status !== 'maintenance' ? (
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4 text-accent-500" />
                          <span>{pool.temperature}°C</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {pool.status !== 'maintenance' ? (
                        <div className="flex items-center gap-1">
                          <Gauge className="w-4 h-4 text-blue-500" />
                          <span>{pool.dissolvedOxygen} mg/L</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      {pool.status !== 'maintenance' ? (
                        <span className="text-slate-700">{pool.ph}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/pool/${pool.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        详情
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPools.length === 0 && (
          <div className="py-12 text-center">
            <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">没有找到符合条件的养殖池</p>
          </div>
        )}
      </div>
    </div>
  );
}
