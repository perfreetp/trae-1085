export const cn = (...args: (string | boolean | undefined | null)[]): string => {
  return args.filter(Boolean).join(' ');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getObstacleTypeName = (type: string): string => {
  const names: Record<string, string> = {
    tower_crane: '塔吊',
    billboard: '广告牌',
    building: '建筑',
    other: '其他',
  };
  return names[type] || type;
};

export const getStatusName = (status: string): string => {
  const names: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    overheight: '超高',
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    reviewing: '审核中',
    merged: '已合并',
    processing: '处理中',
    rejected: '已驳回',
    issued: '已下发',
    rectifying: '整改中',
    rechecking: '复查中',
    overdue: '已逾期',
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
  };
  return names[status] || status;
};

export const getRiskLevelName = (level: string): string => {
  const names: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
  };
  return names[level] || level;
};

export const getTaskTypeName = (type: string): string => {
  const names: Record<string, string> = {
    routine: '例行巡查',
    special: '专项核查',
    emergency: '紧急任务',
  };
  return names[type] || type;
};

export const getAnnouncementTypeName = (type: string): string => {
  const names: Record<string, string> = {
    notice: '通知公告',
    warning: '预警提示',
    policy: '政策法规',
  };
  return names[type] || type;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
