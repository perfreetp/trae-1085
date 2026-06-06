export interface FlowRecord {
  id: string;
  action: 'issue' | 'receive' | 'request_recheck' | 'pass' | 'return' | 'create' | 'publish' | 'withdraw' | 'urge';
  actionName: string;
  operator: string;
  operateTime: string;
  remark?: string;
}

export interface UrgeRecord {
  id: string;
  content: string;
  operator: string;
  urgeTime: string;
}

export interface Obstacle {
  id: string;
  name: string;
  type: 'tower_crane' | 'billboard' | 'building' | 'other';
  height: number;
  latitude: number;
  longitude: number;
  address: string;
  photos: string[];
  ownerUnit: string;
  contactPerson: string;
  contactPhone: string;
  isTemporary: boolean;
  validFrom?: string;
  validTo?: string;
  status: 'normal' | 'warning' | 'overheight';
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  checked: boolean;
  checkTime?: string;
  photos?: string[];
  remark?: string;
}

export interface PatrolTask {
  id: string;
  title: string;
  type: 'routine' | 'special' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
  routePoints: RoutePoint[];
  startTime: string;
  endTime?: string;
  progress: number;
  description: string;
  sourceReportId?: string;
  createdAt: string;
}

export interface PublicReport {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos: string[];
  reporterName: string;
  reporterPhone: string;
  status: 'pending' | 'reviewing' | 'merged' | 'processing' | 'completed' | 'rejected';
  mergedInto?: string;
  relatedTaskId?: string;
  createdAt: string;
}

export interface RectificationNotice {
  id: string;
  obstacleId: string;
  obstacleName: string;
  title: string;
  content: string;
  responsibleUnit: string;
  contactPerson: string;
  contactPhone: string;
  deadline: string;
  status: 'issued' | 'rectifying' | 'rechecking' | 'completed' | 'overdue';
  issueTime: string;
  rectificationTime?: string;
  recheckTime?: string;
  recheckResult?: string;
  returnReason?: string;
  returnTime?: string;
  photos: string[];
  flowRecords: FlowRecord[];
  urgeRecords: UrgeRecord[];
  lastUrgeTime?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'warning' | 'policy';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishTime?: string;
  scheduledPublishTime?: string;
  author: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'patrol' | 'operator' | 'public';
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface TodoItem {
  id: string;
  type: 'report_pending' | 'notice_receive' | 'notice_recheck' | 'notice_overdue' | 'task_pending';
  typeName: string;
  title: string;
  sourceModule: string;
  responsibleUnit?: string;
  assignee?: string;
  deadline?: string;
  planTime?: string;
  relatedId: string;
}

export interface Statistics {
  totalObstacles: number;
  pendingTasks: number;
  newThisMonth: number;
  overheightWarnings: number;
  taskCompletionRate: number;
  reportProcessingRate: number;
  overdueNotices: number;
  pendingReports: number;
  pendingReceiveNotices: number;
  pendingRecheckNotices: number;
  totalTodos: number;
}

export interface RiskHotspot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  riskCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface UnitStats {
  unitName: string;
  obstacleCount: number;
  rectificationCount: number;
  overdueCount: number;
  taskCompletionRate: number;
  taskCount: number;
  completedTaskCount: number;
}

export interface ImportError {
  line: number;
  content: string;
  reason: string;
}
