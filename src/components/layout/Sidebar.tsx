import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Map,
  Building2,
  ClipboardList,
  Users,
  FileCheck,
  AlertTriangle,
  Bell,
  BarChart3,
  Shield,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAppStore } from '@/store/useAppStore';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  showBadge?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: '地图首页', icon: <Map size={20} /> },
  { path: '/todo', label: '协同待办', icon: <CheckSquare size={20} />, showBadge: true },
  { path: '/obstacles', label: '障碍物台账', icon: <Building2 size={20} /> },
  { path: '/patrol-tasks', label: '巡查任务', icon: <ClipboardList size={20} /> },
  { path: '/public-report', label: '群众上报', icon: <Users size={20} /> },
  { path: '/inspection', label: '核查处置', icon: <FileCheck size={20} /> },
  { path: '/risk-assessment', label: '风险评估', icon: <AlertTriangle size={20} /> },
  { path: '/announcements', label: '公告管理', icon: <Bell size={20} /> },
  { path: '/reports', label: '分析报表', icon: <BarChart3 size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, getTodoList } = useAppStore();
  const todoCount = getTodoList().length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 transition-all duration-300',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Shield size={24} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-base font-bold text-white">净空保护</h1>
              <p className="text-xs text-slate-400">低空安全管理系统</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                    sidebarCollapsed && 'justify-center px-0'
                  )
                }
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
                {item.showBadge && todoCount > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {todoCount > 99 ? '99+' : todoCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!sidebarCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
            <p className="text-sm font-medium">需要帮助？</p>
            <p className="mt-1 text-xs text-blue-200">查看使用手册或联系管理员</p>
          </div>
        </div>
      )}
    </aside>
  );
};
