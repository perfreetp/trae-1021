import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  ClipboardList,
  Microscope,
  Zap,
  BarChart3,
  FileText,
  Bell,
  User,
  Menu,
  X,
  Fish,
} from 'lucide-react';

const navItems = [
  { path: '/', label: '生产总览', icon: LayoutDashboard },
  { path: '/pools', label: '池位详情', icon: Droplets },
  { path: '/tasks', label: '作业任务', icon: ClipboardList },
  { path: '/quality', label: '质量检测', icon: Microscope },
  { path: '/energy', label: '设备能耗', icon: Zap },
  { path: '/batches', label: '批次追踪', icon: BarChart3 },
  { path: '/reports', label: '报表中心', icon: FileText },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Fish className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">智慧渔仓</h1>
                <p className="text-xs text-primary-300">循环水养殖系统</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${
                    !sidebarOpen ? 'justify-center' : ''
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">陈主管</p>
                <p className="text-xs text-primary-300 truncate">车间主管</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find((item) => item.path === window.location.pathname)?.label || '生产总览'}
            </h2>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">告警通知</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-slate-50 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <span className="pulse-dot mt-1">
                          <span className="bg-red-500"></span>
                          <span className="bg-red-500"></span>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">B01池溶氧过低</p>
                          <p className="text-xs text-slate-500 mt-0.5">2分钟前</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b border-slate-50 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <span className="pulse-dot mt-1">
                          <span className="bg-red-500"></span>
                          <span className="bg-red-500"></span>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">B01池水温过高</p>
                          <p className="text-xs text-slate-500 mt-0.5">4分钟前</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <span className="pulse-dot mt-1">
                          <span className="bg-accent-500"></span>
                          <span className="bg-accent-500"></span>
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">3号增氧机异常</p>
                          <p className="text-xs text-slate-500 mt-0.5">25分钟前</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700" id="current-time">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-slate-500">实时监控中</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
