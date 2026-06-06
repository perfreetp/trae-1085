import { create } from 'zustand';
import type { User, Notification } from '@/types';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  currentUser: {
    id: '1',
    name: '管理员',
    role: 'admin',
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  notifications: [
    {
      id: '1',
      type: 'warning',
      title: '超高预警',
      message: '国贸中心大厦高度超出限制值，请及时处理',
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: '新任务',
      message: '您有一个新的巡查任务待处理',
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: '整改完成',
      message: '机场大道广告牌整改工作已通过复查',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ],
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
