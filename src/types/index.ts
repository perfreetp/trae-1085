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
  photos: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'warning' | 'policy';
  status: 'draft' | 'published' | 'archived';
  publishTime?: string;
  author: string;
  views: number;
  createdAt: string;
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

export interface Statistics {
  totalObstacles: number;
  pendingTasks: number;
  newThisMonth: number;
  overheightWarnings: number;
  taskCompletionRate: number;
  reportProcessingRate: number;
}

export interface RiskHotspot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  riskCount: number;
  riskLevel: 'low' | 'medium' | 'high';
}
