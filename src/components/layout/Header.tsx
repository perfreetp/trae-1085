import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn, formatDateTime } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, notifications, markNotificationRead, removeNotification } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-emerald-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <header className={cn(
      'fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300',
      sidebarCollapsed ? 'left-20' : 'left-64'
    )}>
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索障碍物、任务..."
              className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h3 className="font-semibold text-gray-900">通知中心</h3>
                  <span className="text-xs text-gray-500">{unreadCount} 条未读</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">暂无通知</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'border-b border-gray-50 px-4 py-3 hover:bg-gray-50 transition-colors',
                          !n.read && 'bg-blue-50/50'
                        )}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('mt-0.5', getNotificationIcon(n.type))}>
                            <Bell size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.message}</p>
                            <p className="mt-1 text-xs text-gray-400">{formatDateTime(n.createdAt)}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-100 p-3">
                  <Button variant="secondary" size="sm" className="w-full">查看全部通知</Button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <User size={16} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">管理员</p>
                <p className="text-xs text-gray-500">系统管理员</p>
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="p-2">
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} />
                    个人设置
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Bell size={16} />
                    通知设置
                  </button>
                  <div className="my-1 h-px bg-gray-100" />
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
