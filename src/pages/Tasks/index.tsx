import { useState } from 'react';
import {
  ClipboardList,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Utensils,
  Search,
  Shield,
  Pill,
  ArrowRightLeft,
  Fish,
  Calendar,
  User,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { tasks as initialTasks } from '../../data/tasks';
import type { Task } from '../../types';

const taskTypeLabels: Record<string, string> = {
  all: '全部',
  feeding: '投喂',
  inspection: '巡检',
  disinfection: '消毒',
  medicine: '药浴',
  transfer: '转池',
  harvest: '出鱼',
};

const taskTypeIcons: Record<string, React.ReactNode> = {
  feeding: <Utensils className="w-4 h-4" />,
  inspection: <Search className="w-4 h-4" />,
  disinfection: <Shield className="w-4 h-4" />,
  medicine: <Pill className="w-4 h-4" />,
  transfer: <ArrowRightLeft className="w-4 h-4" />,
  harvest: <Fish className="w-4 h-4" />,
};

const statusLabels: Record<string, string> = {
  pending: '待办',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

const statusColors: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-primary-100 text-primary-700',
  completed: 'bg-secondary-100 text-secondary-700',
  cancelled: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  feeding: 'bg-accent-100 text-accent-700',
  inspection: 'bg-blue-100 text-blue-700',
  disinfection: 'bg-green-100 text-green-700',
  medicine: 'bg-purple-100 text-purple-700',
  transfer: 'bg-amber-100 text-amber-700',
  harvest: 'bg-rose-100 text-rose-700',
};

const userNameMap: Record<string, string> = {
  'u-001': '张三',
  'u-002': '李四',
  'u-003': '王五',
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeType, setActiveType] = useState<string>('all');

  const stats = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    cancelled: tasks.filter((t) => t.status === 'cancelled').length,
  };

  const filteredTasks = activeType === 'all'
    ? tasks
    : tasks.filter((t) => t.type === activeType);

  const handleStatusChange = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const statusFlow: Record<string, string> = {
          pending: 'in_progress',
          in_progress: 'completed',
          completed: 'completed',
          cancelled: 'cancelled',
        };
        return { ...task, status: statusFlow[task.status] as Task['status'] };
      })
    );
  };

  const getNextStatusAction = (status: string) => {
    if (status === 'pending') return { icon: Play, label: '开始' };
    if (status === 'in_progress') return { icon: CheckCircle, label: '完成' };
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">任务管理</h1>
          <p className="text-slate-500 mt-1">管理和跟踪日常作业任务</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.pending}</p>
              <p className="stat-label">待办任务</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.in_progress}</p>
              <p className="stat-label">进行中</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.completed}</p>
              <p className="stat-label">已完成</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.cancelled}</p>
              <p className="stat-label">已取消</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(taskTypeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeType === key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>暂无任务</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const action = getNextStatusAction(task.status);
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {task.title}
                        </h3>
                        <span
                          className={`badge ${typeColors[task.type]} flex items-center gap-1`}
                        >
                          {taskTypeIcons[task.type]}
                          {taskTypeLabels[task.type]}
                        </span>
                        <span className={`badge ${statusColors[task.status]}`}>
                          {statusLabels[task.status]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{userNameMap[task.assignedTo] || '未分配'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                        {task.poolNo && (
                          <div className="flex items-center gap-1">
                            <Droplets className="w-4 h-4" />
                            <span>{task.poolNo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {action && (
                        <button
                          onClick={() => handleStatusChange(task.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          <action.icon className="w-4 h-4" />
                          {action.label}
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
