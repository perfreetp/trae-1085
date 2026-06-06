import { create } from 'zustand';
import type {
  User,
  Notification,
  Obstacle,
  PatrolTask,
  PublicReport,
  RectificationNotice,
  Announcement,
  FlowRecord,
} from '@/types';
import { mockObstacles } from '@/data/obstacles';
import { mockPatrolTasks, mockRectificationNotices } from '@/data/tasks';
import { mockPublicReports } from '@/data/reports';
import { mockAnnouncements } from '@/data/announcements';
import { generateId } from '@/utils/helpers';

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
  batchAddObstacles: (obstacles: Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt'>[]) => void;

  patrolTasks: PatrolTask[];
  addPatrolTask: (task: Omit<PatrolTask, 'id' | 'createdAt' | 'progress'>) => void;
  updatePatrolTask: (id: string, data: Partial<PatrolTask>) => void;
  startTask: (id: string) => void;
  checkRoutePoint: (taskId: string, pointId: string, photos?: string[], remark?: string) => void;
  createTaskFromReport: (reportId: string, assignee: string, startTime: string) => string;

  publicReports: PublicReport[];
  updatePublicReport: (id: string, data: Partial<PublicReport>) => void;
  approveReport: (id: string) => void;
  rejectReport: (id: string) => void;
  mergeReport: (sourceId: string, targetId: string) => void;

  rectificationNotices: RectificationNotice[];
  addRectificationNotice: (notice: Omit<RectificationNotice, 'id' | 'flowRecords'>) => void;
  updateRectificationNotice: (id: string, data: Partial<RectificationNotice>) => void;
  confirmReceive: (id: string, operator: string, remark?: string) => void;
  requestRecheck: (id: string, operator: string, remark?: string) => void;
  passRecheck: (id: string, result: string, operator: string) => void;
  returnRectification: (id: string, reason: string, operator: string) => void;
  addFlowRecord: (noticeId: string, record: Omit<FlowRecord, 'id'>) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'views' | 'updatedAt'>) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  publishAnnouncement: (id: string) => void;
  withdrawAnnouncement: (id: string) => void;
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
  batchAddObstacles: (obstacles) =>
    set((state) => {
      const now = new Date().toISOString();
      const newObstacles = obstacles.map((o, index) => ({
        ...o,
        id: Date.now().toString() + index,
        createdAt: now,
        updatedAt: now,
      }));
      return { obstacles: [...newObstacles, ...state.obstacles] };
    }),

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
  createTaskFromReport: (reportId, assignee, startTime) => {
    const report = get().publicReports.find((r) => r.id === reportId);
    if (!report) return '';
    
    const taskId = Date.now().toString();
    const newTask: PatrolTask = {
      id: taskId,
      title: report.title,
      type: 'special',
      status: 'pending',
      assignee,
      routePoints: [
        {
          id: generateId(),
          name: report.location.address,
          latitude: report.location.latitude,
          longitude: report.location.longitude,
          order: 1,
          checked: false,
        },
      ],
      startTime,
      progress: 0,
      description: report.description,
      sourceReportId: reportId,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      patrolTasks: [newTask, ...state.patrolTasks],
      publicReports: state.publicReports.map((r) =>
        r.id === reportId ? { ...r, relatedTaskId: taskId, status: 'processing' as const } : r
      ),
    }));
    
    return taskId;
  },

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
    set((state) => {
      const now = new Date().toISOString();
      const newNotice: RectificationNotice = {
        ...notice,
        id: Date.now().toString(),
        flowRecords: [
          {
            id: generateId(),
            action: 'issue',
            actionName: '下发整改通知',
            operator: '管理员',
            operateTime: now,
            remark: '系统自动下发',
          },
        ],
      };
      return { rectificationNotices: [newNotice, ...state.rectificationNotices] };
    }),
  updateRectificationNotice: (id, data) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id ? { ...n, ...data } : n
      ),
    })),
  addFlowRecord: (noticeId, record) =>
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === noticeId
          ? {
              ...n,
              flowRecords: [
                ...n.flowRecords,
                { ...record, id: generateId() },
              ],
            }
          : n
      ),
    })),
  confirmReceive: (id, operator, remark) => {
    const now = new Date().toISOString();
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'rectifying' as const,
              rectificationTime: now,
              flowRecords: [
                ...n.flowRecords,
                {
                  id: generateId(),
                  action: 'receive',
                  actionName: '确认接收',
                  operator,
                  operateTime: now,
                  remark,
                },
              ],
            }
          : n
      ),
    }));
  },
  requestRecheck: (id, operator, remark) => {
    const now = new Date().toISOString();
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'rechecking' as const,
              recheckTime: now,
              flowRecords: [
                ...n.flowRecords,
                {
                  id: generateId(),
                  action: 'request_recheck',
                  actionName: '申请复查',
                  operator,
                  operateTime: now,
                  remark,
                },
              ],
            }
          : n
      ),
    }));
  },
  passRecheck: (id, result, operator) => {
    const now = new Date().toISOString();
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'completed' as const,
              recheckResult: result,
              flowRecords: [
                ...n.flowRecords,
                {
                  id: generateId(),
                  action: 'pass',
                  actionName: '通过销号',
                  operator,
                  operateTime: now,
                  remark: result,
                },
              ],
            }
          : n
      ),
    }));
  },
  returnRectification: (id, reason, operator) => {
    const now = new Date().toISOString();
    set((state) => ({
      rectificationNotices: state.rectificationNotices.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'rectifying' as const,
              returnReason: reason,
              returnTime: now,
              flowRecords: [
                ...n.flowRecords,
                {
                  id: generateId(),
                  action: 'return',
                  actionName: '退回整改',
                  operator,
                  operateTime: now,
                  remark: reason,
                },
              ],
            }
          : n
      ),
    }));
  },

  announcements: [...mockAnnouncements],
  addAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [
        {
          ...announcement,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
        },
        ...state.announcements,
      ],
    })),
  updateAnnouncement: (id, data) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
      ),
    })),
  publishAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, status: 'published' as const, publishTime: new Date().toISOString(), views: 0, updatedAt: new Date().toISOString() } : a
      ),
    })),
  withdrawAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, status: 'draft' as const, publishTime: undefined, updatedAt: new Date().toISOString() } : a
      ),
    })),
  deleteAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter((a) => a.id !== id),
    })),
}));
