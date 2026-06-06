import { useState } from 'react';
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
} from 'lucide-react';
import {
  monthlyTrendData,
  obstacleTypeData,
  riskLevelData,
  mockStatistics,
} from '@/data/reports';

const Reports = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const taskCompletionData = [
    { name: '第1周', completed: 15, total: 20 },
    { name: '第2周', completed: 18, total: 22 },
    { name: '第3周', completed: 12, total: 18 },
    { name: '第4周', completed: 20, total: 25 },
  ];

  const areaTrendData = monthlyTrendData.map((item) => ({
    ...item,
    total: item.obstacles + item.tasks + item.reports,
  }));

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
                variant={timeRange === item.key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(item.key as typeof timeRange)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="障碍物总数"
          value={mockStatistics.totalObstacles}
          icon={<BarChart3 className="w-5 h-5" />}
          trend={{ value: 12, isUp: true }}
          color="blue"
        />
        <StatCard
          title="任务完成率"
          value={`${mockStatistics.taskCompletionRate}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={{ value: 5.2, isUp: true }}
          color="green"
        />
        <StatCard
          title="超高预警"
          value={mockStatistics.overheightWarnings}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend={{ value: 2, isUp: false }}
          color="amber"
        />
        <StatCard
          title="上报处理率"
          value={`${mockStatistics.reportProcessingRate}%`}
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
                月度趋势分析
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
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
                <p className="text-sm text-slate-600">本月新增障碍物</p>
                <p className="text-2xl font-bold text-blue-600">{mockStatistics.newThisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">待处理任务</p>
                <p className="text-2xl font-bold text-emerald-600">{mockStatistics.pendingTasks}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">超高预警数</p>
                <p className="text-2xl font-bold text-amber-600">{mockStatistics.overheightWarnings}</p>
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
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
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
    </div>
  );
};

export default Reports;
