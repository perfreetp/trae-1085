import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/common/StatCard';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Filter,
  FileText,
  Building2,
} from 'lucide-react';
import {
  obstacleTypeData,
  riskLevelData,
} from '@/data/reports';
import { useAppStore } from '@/store/useAppStore';

type TimeRange = 'month' | 'quarter' | 'year';
type UnitDimension = 'all' | 'byUnit';

interface UnitStat {
  name: string;
  obstacles: number;
  notices: number;
  overdue: number;
  completionRate: number;
}

const Reports = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [unitDimension, setUnitDimension] = useState<UnitDimension>('all');
  const getUnitStats = useAppStore((state) => state.getUnitStats);
  const obstacles = useAppStore((state) => state.obstacles);
  const patrolTasks = useAppStore((state) => state.patrolTasks);
  const rectificationNotices = useAppStore((state) => state.rectificationNotices);
  const publicReports = useAppStore((state) => state.publicReports);

  const startDate = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }, [timeRange]);

  const filteredObstacles = useMemo(() => {
    return obstacles.filter((o) => new Date(o.createdAt) >= startDate);
  }, [obstacles, startDate]);

  const filteredPatrolTasks = useMemo(() => {
    return patrolTasks.filter((t) => new Date(t.createdAt) >= startDate);
  }, [patrolTasks, startDate]);

  const filteredRectificationNotices = useMemo(() => {
    return rectificationNotices.filter((n) => new Date(n.issueTime) >= startDate);
  }, [rectificationNotices, startDate]);

  const filteredPublicReports = useMemo(() => {
    return publicReports.filter((r) => new Date(r.createdAt) >= startDate);
  }, [publicReports, startDate]);

  const statisticsByTimeRange = useMemo(() => {
    const totalObstacles = filteredObstacles.length;
    const overheightWarnings = filteredObstacles.filter((o) => o.status === 'overheight').length;
    const completedTasks = filteredPatrolTasks.filter((t) => t.status === 'completed').length;
    const taskCompletionRate = filteredPatrolTasks.length > 0
      ? parseFloat(((completedTasks / filteredPatrolTasks.length) * 100).toFixed(1))
      : 0;
    const reportProcessingRate = 85.2;

    return {
      totalObstacles,
      pendingTasks: filteredPatrolTasks.filter((t) => t.status !== 'completed').length,
      newThisMonth: totalObstacles,
      overheightWarnings,
      taskCompletionRate,
      reportProcessingRate,
    };
  }, [filteredObstacles, filteredPatrolTasks]);

  const trendDataByTimeRange = useMemo(() => {
    const now = new Date();
    const data: { name: string; obstacles: number; tasks: number; reports: number }[] = [];

    const countByDate = (items: { createdAt: string }[], start: Date, end: Date) => {
      return items.filter((item) => {
        const date = new Date(item.createdAt);
        return date >= start && date < end;
      }).length;
    };

    const countNoticesByDate = (items: { issueTime: string }[], start: Date, end: Date) => {
      return items.filter((item) => {
        const date = new Date(item.issueTime);
        return date >= start && date < end;
      }).length;
    };

    switch (timeRange) {
      case 'month': {
        const weeks = 4;
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        for (let i = 0; i < weeks; i++) {
          const weekStart = new Date(monthStart.getTime() + i * weekMs);
          const weekEnd = new Date(monthStart.getTime() + (i + 1) * weekMs);
          data.push({
            name: `第${i + 1}周`,
            obstacles: countByDate(filteredObstacles, weekStart, weekEnd),
            tasks: countByDate(filteredPatrolTasks, weekStart, weekEnd),
            reports: countByDate(filteredPublicReports, weekStart, weekEnd),
          });
        }
        break;
      }
      case 'quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        for (let i = 0; i < 3; i++) {
          const monthStart = new Date(now.getFullYear(), quarter * 3 + i, 1);
          const monthEnd = new Date(now.getFullYear(), quarter * 3 + i + 1, 1);
          const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          data.push({
            name: monthNames[quarter * 3 + i],
            obstacles: countByDate(filteredObstacles, monthStart, monthEnd),
            tasks: countByDate(filteredPatrolTasks, monthStart, monthEnd),
            reports: countByDate(filteredPublicReports, monthStart, monthEnd),
          });
        }
        break;
      }
      case 'year': {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 1);
          data.push({
            name: monthNames[i],
            obstacles: countByDate(filteredObstacles, monthStart, monthEnd),
            tasks: countByDate(filteredPatrolTasks, monthStart, monthEnd),
            reports: countByDate(filteredPublicReports, monthStart, monthEnd),
          });
        }
        break;
      }
    }

    return data;
  }, [timeRange, filteredObstacles, filteredPatrolTasks, filteredPublicReports]);

  const taskCompletionData = useMemo(() => {
    const now = new Date();
    const data: { name: string; completed: number; total: number }[] = [];

    const countTasksByDate = (start: Date, end: Date) => {
      const tasks = filteredPatrolTasks.filter((t) => {
        const date = new Date(t.createdAt);
        return date >= start && date < end;
      });
      return {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'completed').length,
      };
    };

    switch (timeRange) {
      case 'month': {
        const weeks = 4;
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        for (let i = 0; i < weeks; i++) {
          const weekStart = new Date(monthStart.getTime() + i * weekMs);
          const weekEnd = new Date(monthStart.getTime() + (i + 1) * weekMs);
          const counts = countTasksByDate(weekStart, weekEnd);
          data.push({
            name: `第${i + 1}周`,
            completed: counts.completed,
            total: counts.total,
          });
        }
        break;
      }
      case 'quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        for (let i = 0; i < 3; i++) {
          const monthStart = new Date(now.getFullYear(), quarter * 3 + i, 1);
          const monthEnd = new Date(now.getFullYear(), quarter * 3 + i + 1, 1);
          const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          const counts = countTasksByDate(monthStart, monthEnd);
          data.push({
            name: monthNames[quarter * 3 + i],
            completed: counts.completed,
            total: counts.total,
          });
        }
        break;
      }
      case 'year': {
        const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
        for (let i = 0; i < 4; i++) {
          const quarterStart = new Date(now.getFullYear(), i * 3, 1);
          const quarterEnd = new Date(now.getFullYear(), i * 3 + 3, 1);
          const counts = countTasksByDate(quarterStart, quarterEnd);
          data.push({
            name: quarterNames[i],
            completed: counts.completed,
            total: counts.total,
          });
        }
        break;
      }
    }

    return data;
  }, [timeRange, filteredPatrolTasks]);

  const areaTrendData = useMemo(() => {
    return trendDataByTimeRange.map((item) => ({
      ...item,
      total: item.obstacles + item.tasks + item.reports,
    }));
  }, [trendDataByTimeRange]);

  const trendTitle = useMemo(() => {
    switch (timeRange) {
      case 'month': return '本月趋势分析';
      case 'quarter': return '季度趋势分析';
      case 'year': return '年度趋势分析';
      default: return '趋势分析';
    }
  }, [timeRange]);

  const quickStats = useMemo(() => {
    return {
      newObstacles: filteredObstacles.length,
      pendingTasks: filteredPatrolTasks.filter((t) => t.status !== 'completed').length,
      warnings: filteredObstacles.filter((o) => o.status === 'overheight').length,
    };
  }, [filteredObstacles, filteredPatrolTasks]);

  const newObstaclesLabel = useMemo(() => {
    switch (timeRange) {
      case 'month': return '本月新增障碍物';
      case 'quarter': return '本季度新增障碍物';
      case 'year': return '本年度新增障碍物';
      default: return '新增障碍物';
    }
  }, [timeRange]);

  const unitStatsData = useMemo((): UnitStat[] => {
    const stats = getUnitStats(timeRange);
    return stats.map((item) => ({
      name: item.unitName,
      obstacles: item.obstacleCount,
      notices: item.rectificationCount,
      overdue: item.overdueCount,
      completionRate: item.taskCompletionRate,
    }));
  }, [timeRange, getUnitStats]);

  const unitBarChartData = useMemo(() => {
    return unitStatsData.map((item) => ({
      name: item.name,
      障碍物数量: item.obstacles,
    }));
  }, [unitStatsData]);

  const unitSummary = useMemo(() => {
    const totalObstacles = unitStatsData.reduce((sum, item) => sum + item.obstacles, 0);
    const totalNotices = unitStatsData.reduce((sum, item) => sum + item.notices, 0);
    const totalOverdue = unitStatsData.reduce((sum, item) => sum + item.overdue, 0);
    const avgCompletionRate = unitStatsData.length > 0
      ? (unitStatsData.reduce((sum, item) => sum + item.completionRate, 0) / unitStatsData.length).toFixed(1)
      : '0';
    return { totalObstacles, totalNotices, totalOverdue, avgCompletionRate };
  }, [unitStatsData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">分析报表</h1>
          <p className="text-slate-500 mt-1">多维度数据分析与可视化展示</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[
              { key: 'month', label: '本月' },
              { key: 'quarter', label: '本季度' },
              { key: 'year', label: '本年度' },
            ].map((item) => (
              <Button
                key={item.key}
                variant={timeRange === item.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeRange(item.key as TimeRange)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">责任单位维度：</span>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {[
            { key: 'all', label: '全部' },
            { key: 'byUnit', label: '按单位查看' },
          ].map((item) => (
            <Button
              key={item.key}
              variant={unitDimension === item.key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setUnitDimension(item.key as UnitDimension)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {unitDimension === 'all' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="障碍物总数"
              value={statisticsByTimeRange.totalObstacles}
              icon={<BarChart3 className="w-5 h-5" />}
              trend={{ value: 12, isUp: true }}
              color="blue"
            />
            <StatCard
              title="任务完成率"
              value={`${statisticsByTimeRange.taskCompletionRate}%`}
              icon={<CheckCircle className="w-5 h-5" />}
              trend={{ value: 5.2, isUp: true }}
              color="green"
            />
            <StatCard
              title="超高预警"
              value={statisticsByTimeRange.overheightWarnings}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={{ value: 2, isUp: false }}
              color="amber"
            />
            <StatCard
              title="上报处理率"
              value={`${statisticsByTimeRange.reportProcessingRate}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ value: 3.8, isUp: true }}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    {trendTitle}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendDataByTimeRange}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="obstacles"
                      name="障碍物"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: '#2563EB', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      name="巡查任务"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      name="群众上报"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    任务完成情况
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" name="已完成" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" name="总任务" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>障碍物类型分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={obstacleTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {obstacleTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>风险等级分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>快速统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">{newObstaclesLabel}</p>
                    <p className="text-2xl font-bold text-blue-600">{quickStats.newObstacles}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">待处理任务</p>
                    <p className="text-2xl font-bold text-emerald-600">{quickStats.pendingTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600">超高预警数</p>
                    <p className="text-2xl font-bold text-amber-600">{quickStats.warnings}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  综合趋势一览
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="obstacles"
                    name="障碍物"
                    stackId="1"
                    stroke="#2563EB"
                    fill="#93C5FD"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="巡查任务"
                    stackId="1"
                    stroke="#10B981"
                    fill="#6EE7B7"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    name="群众上报"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#FCD34D"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="责任单位数"
              value={unitStatsData.length}
              icon={<Building2 className="w-5 h-5" />}
              trend={{ value: 0, isUp: true }}
              color="blue"
            />
            <StatCard
              title="障碍物总数"
              value={unitSummary.totalObstacles}
              icon={<BarChart3 className="w-5 h-5" />}
              trend={{ value: 8, isUp: true }}
              color="purple"
            />
            <StatCard
              title="整改通知总数"
              value={unitSummary.totalNotices}
              icon={<FileText className="w-5 h-5" />}
              trend={{ value: 5, isUp: true }}
              color="amber"
            />
            <StatCard
              title="平均完成率"
              value={`${unitSummary.avgCompletionRate}%`}
              icon={<CheckCircle className="w-5 h-5" />}
              trend={{ value: 3.2, isUp: true }}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    责任单位障碍物数量对比
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={unitBarChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94A3B8"
                      fontSize={12}
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="障碍物数量"
                      fill="#2563EB"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    责任单位统计详情
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-medium text-slate-600">责任单位</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-600">障碍物</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-600">整改通知</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-600">逾期</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-600">完成率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitStatsData.map((unit, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 font-medium text-slate-900">{unit.name}</td>
                          <td className="py-3 px-2 text-center text-slate-700">{unit.obstacles}</td>
                          <td className="py-3 px-2 text-center text-slate-700">{unit.notices}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              unit.overdue > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {unit.overdue}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`font-medium ${
                              unit.completionRate >= 90 ? 'text-green-600' :
                              unit.completionRate >= 80 ? 'text-blue-600' :
                              'text-amber-600'
                            }`}>
                              {unit.completionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
