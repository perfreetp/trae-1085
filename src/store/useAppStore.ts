import { create } from 'zustand';
import type {
  User,
  Notification,
  Obstacle,
  PatrolTask,
  PublicReport,
  RectificationNotice,
  Announcement,
} from '@/types';
import { mockObstacles } from '@/data/obstacles';
import { mockPatrolTasks, mockRectificationNotices } from '@/data/tasks';
import { mockPublicReports } from '@/data/reports';
import { mockAnnouncements } from '@/data/announcements';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;

  obstacles: Obstacle[];
  addObstacle: (obstacle: Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateObstacle: (id: string, data: Partial<Obstacle>) => void;
  deleteObstacle: (id: string) => void;

  patrolTasks: PatrolTask[];
  addPatrolTask: (task: Omit<PatrolTask, 'id' | 'createdAt' | 'progress'>) => void;
  updatePatrolTask: (id: string, data: Partial<PatrolTask>) => void;
  startTask: (id: string) => void;
  checkRoutePoint: (taskId: string, pointId: string, photos?: string[], remark?: string) => void;

  publicReports: PublicReport[];
  updatePublicReport: (id: string, data: Partial<PublicReport>) => void;
  approveReport: (id: string) => void;
  rejectReport: (id: string) => void;
  mergeReport: (sourceId: string, targetId: string) => void;

  rectificationNotices: RectificationNotice[];
  addRectificationNotice: (notice: Omit<RectificationNotice, 'id'>) => void;
  updateRectificationNotice: (id: string, data: Partial<RectificationNotice>) => void;
  confirmReceive: (id: string) => void;
  requestRecheck: (id: string) => void;
  passRecheck: (id: string, result: string) => void;
  returnRectification: (id: string) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'views'>) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  publishAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
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

  obstacles: [...mockObstacles],
  addObstacle: (obstacle) =>
    set((state) => ({
      obstacles: [
        {
          ...obstacle,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.obstacles,
      ],
    })),
  updateObstacle: (id, data) =>
    set((state) => ({
      obstacles: state.obstacles.map((o) =>
        o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o
      ),
    })),
  deleteObstacle: (id) =>
    set((state) => ({
      obstacles: state.obstacles.filter((o) => o.id !== id),
    })),

  patrolTasks: [...mockPatrolTasks],
  addPatrolTask: (task) =>
    set((state) => ({
      patrolTasks: [
        {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          progress: 0,
        },
        ...state.patrolTasks,
      ],
    })),
  updatePatrolTask: (id, data) =>
    set((state) => ({
      patrolTasks: state.patrolTasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),
  startTask: (id) =>
    set((state) => ({
      patrolTasks: state.patrolTasks.map((t) =>
        t.id === id ? { ...t, status: 'in_progress' as const } : t
      ),
    })),
  checkRoutePoint: (taskId, pointId, photos, remark) =>
    set((state) => {
      const tasks = state.patrolTasks.map((task) => {
        if (task.id !== taskId) return task;
        const updatedPoints = task.routePoints.map((p) =>
          p.id === pointId
            ? { ...p, checked: true, checkTime: new Date().toISOString(), photos, remark }
            : p
        );
        const checkedCount = updatedPoints.filter((p) => p.checked).length;
        const totalCount = updatedPoints.length;
        const progress = Math.round((checkedCount / totalCount) * 100);
        const isCompleted = progress === 100;
        return {
          ...task,
          routePoints: updatedPoints,
          progress,
          status: isCompleted ? ('completed' as const) : task.status,
          endTime: isCompleted ? new Date().toISOString() : task.endTime,
        };
      });
      return { patrolTasks: tasks };
    }),

  publicReports: [...mockPublicReports],
  updatePublicReport: (id, data) =>
    set((state) => ({
      publicReports: state.publicReports.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
    })),
  approveReport: (id) =>
    set((state) => ({
      publicReports: state.publicReports.map((r) =>
        r.id === id ? { ...r, status: 'processing' as const } : r
      ),
    })),
  rejectReport: (id) =>
    set((state) => ({
      publicReports: state.publicReports.map((r) =>
        r.id === id ? { ...r, status: 'rejected' as const } : r
      ),
    })),
  mergeReport: (sourceId, targetId) =>
    set((state) => ({
      publicReports: state.publicReports.map((r) =>
        r.id === sourceId ? { ...r, status: 'merged' as const, mergedInto: targetId } : r
      ),
    })),

  rectificationNotices: [...mockRectificationNotices],
  addRectificationNotice: (notice) =>
    set((state) => ({
      rectificationNotices: [
        {
          ...notice,
          id: Date.now().toString(),
        },
        ...state.rectificationNotices,
      ],
    })),
  updateRectificationNotice: (id, data) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, ...data } : n
      ),
    })),
  confirmReceive: (id) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, status: 'rectifying' as const, rectificationTime: new Date().toISOString() } : n
      ),
    })),
  requestRecheck: (id) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, status: 'rechecking' as const, recheckTime: new Date().toISOString() } : n
      ),
    })),
  passRecheck: (id, result) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, status: 'completed' as const, recheckResult: result } : n
      ),
    })),
  returnRectification: (id) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, status: 'rectifying' as const } : n
      ),
    })),

  announcements: [...mockAnnouncements],
  addAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [
        {
          ...announcement,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          views: 0,
        },
        ...state.announcements,
      ],
    })),
  updateAnnouncement: (id, data) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),
  publishAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, status: 'published' as const, publishTime: new Date().toISOString(), views: 0 } : a
      ),
    })),
  deleteAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter((a) => a.id !== id),
    })),
}));
