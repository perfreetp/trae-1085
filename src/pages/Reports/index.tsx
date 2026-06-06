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

  const statisticsByTimeRange = useMemo(() => {
    const base = {
      totalObstacles: 156,
      pendingTasks: 12,
      newThisMonth: 23,
      overheightWarnings: 5,
      taskCompletionRate: 78.5,
      reportProcessingRate: 85.2,
    };
    
    switch (timeRange) {
      case 'month':
        return {
          ...base,
          totalObstacles: 156,
          newThisMonth: 23,
          overheightWarnings: 5,
          taskCompletionRate: 78.5,
          reportProcessingRate: 85.2,
          pendingTasks: 12,
        };
      case 'quarter':
        return {
          ...base,
          totalObstacles: 142,
          newThisMonth: 68,
          overheightWarnings: 12,
          taskCompletionRate: 82.3,
          reportProcessingRate: 88.7,
          pendingTasks: 8,
        };
      case 'year':
        return {
          ...base,
          totalObstacles: 156,
          newThisMonth: 245,
          overheightWarnings: 38,
          taskCompletionRate: 86.4,
          reportProcessingRate: 91.2,
          pendingTasks: 5,
        };
      default:
        return base;
    }
  }, [timeRange]);

  const trendDataByTimeRange = useMemo(() => {
    switch (timeRange) {
      case 'month':
        return [
          { name: '第1周', obstacles: 5, tasks: 3, reports: 2 },
          { name: '第2周', obstacles: 7, tasks: 5, reports: 3 },
          { name: '第3周', obstacles: 6, tasks: 4, reports: 2 },
          { name: '第4周', obstacles: 5, tasks: 0, reports: 1 },
        ];
      case 'quarter':
        return [
          { name: '4月', obstacles: 20, tasks: 15, reports: 11 },
          { name: '5月', obstacles: 22, tasks: 18, reports: 13 },
          { name: '6月', obstacles: 26, tasks: 12, reports: 8 },
        ];
      case 'year':
        return [
          { name: '1月', obstacles: 12, tasks: 8, reports: 5 },
          { name: '2月', obstacles: 15, tasks: 10, reports: 7 },
          { name: '3月', obstacles: 18, tasks: 12, reports: 9 },
          { name: '4月', obstacles: 20, tasks: 15, reports: 11 },
          { name: '5月', obstacles: 22, tasks: 18, reports: 13 },
          { name: '6月', obstacles: 26, tasks: 12, reports: 8 },
          { name: '7月', obstacles: 24, tasks: 16, reports: 10 },
          { name: '8月', obstacles: 28, tasks: 20, reports: 12 },
          { name: '9月', obstacles: 25, tasks: 14, reports: 9 },
          { name: '10月', obstacles: 30, tasks: 22, reports: 15 },
          { name: '11月', obstacles: 27, tasks: 18, reports: 11 },
          { name: '12月', obstacles: 29, tasks: 20, reports: 13 },
        ];
      default:
        return [];
    }
  }, [timeRange]);

  const taskCompletionData = useMemo(() => {
    switch (timeRange) {
      case 'month':
        return [
          { name: '第1周', completed: 15, total: 20 },
          { name: '第2周', completed: 18, total: 22 },
          { name: '第3周', completed: 12, total: 18 },
          { name: '第4周', completed: 20, total: 25 },
        ];
      case 'quarter':
        return [
          { name: '4月', completed: 45, total: 55 },
          { name: '5月', completed: 52, total: 60 },
          { name: '6月', completed: 48, total: 58 },
        ];
      case 'year':
        return [
          { name: 'Q1', completed: 120, total: 145 },
          { name: 'Q2', completed: 145, total: 173 },
          { name: 'Q3', completed: 135, total: 162 },
          { name: 'Q4', completed: 158, total: 180 },
        ];
      default:
        return [];
    }
  }, [timeRange]);

  const areaTrendData = useMemo(() => {
    return trendDataByTimeRange.map((item) => ({
      ...item,
      total: item.obstacles + item.tasks + item.reports,
    }));
  }, [trendDataByTimeRange]);

  const trendTitle = useMemo(() => {
    switch (timeRange) {
      case 'month': return '本周趋势分析';
      case 'quarter': return '季度趋势分析';
      case 'year': return '年度趋势分析';
      default: return '趋势分析';
    }
  }, [timeRange]);

  const quickStats = useMemo(() => {
    switch (timeRange) {
      case 'month':
        return {
          newObstacles: 23,
          pendingTasks: 12,
          warnings: 5,
        };
      case 'quarter':
        return {
          newObstacles: 68,
          pendingTasks: 8,
          warnings: 12,
        };
      case 'year':
        return {
          newObstacles: 245,
          pendingTasks: 5,
          warnings: 38,
        };
      default:
        return {
          newObstacles: 23,
          pendingTasks: 12,
          warnings: 5,
        };
    }
  }, [timeRange]);

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
