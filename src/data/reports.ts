import type { PublicReport, RiskHotspot, Statistics } from '@/types';

export const mockPublicReports: PublicReport[] = [
  {
    id: '1',
    title: '龙阳路附近疑似新增塔吊',
    description: '在龙阳路地铁站附近发现有新增的塔吊设施，高度看起来比较高，可能影响净空安全。',
    location: {
      latitude: 31.2189,
      longitude: 121.4856,
      address: '上海市浦东新区龙阳路地铁站附近',
    },
    photos: [],
    reporterName: '王先生',
    reporterPhone: '13900139001',
    status: 'processing',
    relatedTaskId: '4',
    createdAt: '2026-06-03T11:20:00Z',
  },
  {
    id: '2',
    title: '科技园新建办公楼超高',
    description: '张江科技园科苑路上的新建办公楼看起来比周边建筑高出很多，怀疑超高。',
    location: {
      latitude: 31.2078,
      longitude: 121.5123,
      address: '上海市浦东新区张江高科技园区科苑路88号',
    },
    photos: [],
    reporterName: '李女士',
    reporterPhone: '13900139002',
    status: 'completed',
    relatedTaskId: '2',
    createdAt: '2026-06-01T09:15:00Z',
  },
  {
    id: '3',
    title: '机场大道广告牌存在安全隐患',
    description: '机场大道旁的大型广告牌支架有些生锈，担心大风天气会有危险。',
    location: {
      latitude: 31.1934,
      longitude: 121.4567,
      address: '上海市浦东新区机场大道88号',
    },
    photos: [],
    reporterName: '张先生',
    reporterPhone: '13900139003',
    status: 'reviewing',
    createdAt: '2026-06-04T14:30:00Z',
  },
  {
    id: '4',
    title: '重复举报-龙阳路塔吊',
    description: '龙阳路的塔吊好像还在施工中，看起来越来越高了。',
    location: {
      latitude: 31.2188,
      longitude: 121.4855,
      address: '上海市浦东新区龙阳路附近',
    },
    photos: [],
    reporterName: '陈先生',
    reporterPhone: '13900139004',
    status: 'merged',
    mergedInto: '1',
    createdAt: '2026-06-03T15:45:00Z',
  },
  {
    id: '5',
    title: '迎宾高速入口新增指示牌',
    description: '迎宾高速入口处新安装了一个很高的指示牌塔，想确认一下是否合规。',
    location: {
      latitude: 31.2234,
      longitude: 121.4356,
      address: '上海市浦东新区迎宾高速入口处',
    },
    photos: [],
    reporterName: '刘女士',
    reporterPhone: '13900139005',
    status: 'pending',
    createdAt: '2026-06-05T08:50:00Z',
  },
];

export const mockRiskHotspots: RiskHotspot[] = [
  { id: '1', name: '张江高科技园区东区', latitude: 31.2304, longitude: 121.4737, riskCount: 12, riskLevel: 'high' },
  { id: '2', name: '机场周边区域', latitude: 31.1934, longitude: 121.4567, riskCount: 8, riskLevel: 'high' },
  { id: '3', name: '金桥北区', latitude: 31.2456, longitude: 121.4689, riskCount: 5, riskLevel: 'medium' },
  { id: '4', name: '世纪大道沿线', latitude: 31.2356, longitude: 121.5012, riskCount: 7, riskLevel: 'medium' },
  { id: '5', name: '国家会展中心周边', latitude: 31.1895, longitude: 121.4934, riskCount: 3, riskLevel: 'low' },
];

export const mockStatistics: Statistics = {
  totalObstacles: 156,
  pendingTasks: 12,
  newThisMonth: 23,
  overheightWarnings: 5,
  taskCompletionRate: 78.5,
  reportProcessingRate: 85.2,
  overdueNotices: 2,
};

export const monthlyTrendData = [
  { month: '1月', obstacles: 12, tasks: 8, reports: 5 },
  { month: '2月', obstacles: 15, tasks: 10, reports: 7 },
  { month: '3月', obstacles: 18, tasks: 12, reports: 9 },
  { month: '4月', obstacles: 20, tasks: 15, reports: 11 },
  { month: '5月', obstacles: 22, tasks: 18, reports: 13 },
  { month: '6月', obstacles: 23, tasks: 12, reports: 8 },
];

export const obstacleTypeData = [
  { name: '塔吊', value: 68, color: '#2563EB' },
  { name: '广告牌', value: 42, color: '#F59E0B' },
  { name: '建筑', value: 35, color: '#EF4444' },
  { name: '其他', value: 11, color: '#6B7280' },
];

export const riskLevelData = [
  { name: '低风险', value: 89, color: '#10B981' },
  { name: '中风险', value: 45, color: '#F59E0B' },
  { name: '高风险', value: 22, color: '#EF4444' },
];
