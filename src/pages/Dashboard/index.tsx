import React, { useMemo } from 'react';
import {
  Building2,
  ClipboardList,
  AlertTriangle,
  Plus,
  FileText,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { mockRiskHotspots } from '@/data/reports';
import { getObstacleTypeName, formatDate } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { obstacles, patrolTasks } = useAppStore();

  const statistics = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalObstacles = obstacles.length;
    const pendingTasks = patrolTasks.filter(t => t.status === 'pending').length;
    const newThisMonth = obstacles.filter(o => new Date(o.createdAt) >= firstDayOfMonth).length;
    const overheightWarnings = obstacles.filter(o => o.status === 'overheight').length;
    
    const totalTasks = patrolTasks.length;
    const completedTasks = patrolTasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalObstacles,
      pendingTasks,
      newThisMonth,
      overheightWarnings,
      taskCompletionRate,
      completedTasks,
      inProgressTasks: patrolTasks.filter(t => t.status === 'in_progress').length,
    };
  }, [obstacles, patrolTasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">地图首页</h1>
          <p className="mt-1 text-sm text-gray-500">低空障碍物与净空保护管理概览</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/obstacles')}>
            <Plus size={18} className="mr-2" />
            登记障碍物
          </Button>
          <Button variant="secondary" onClick={() => navigate('/patrol-tasks')}>
            <ClipboardList size={18} className="mr-2" />
            新建任务
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="障碍物总数"
          value={statistics.totalObstacles}
          icon={<Building2 size={24} />}
          trend={{ value: 12.5, isUp: true }}
          color="blue"
        />
        <StatCard
          title="待处理任务"
          value={statistics.pendingTasks}
          icon={<ClipboardList size={24} />}
          trend={{ value: 5.2, isUp: false }}
          color="amber"
        />
        <StatCard
          title="本月新增"
          value={statistics.newThisMonth}
          icon={<Plus size={24} />}
          trend={{ value: 8.3, isUp: true }}
          color="green"
        />
        <StatCard
          title="超高预警"
          value={statistics.overheightWarnings}
          icon={<AlertTriangle size={24} />}
          trend={{ value: 2.1, isUp: true }}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>障碍物分布地图</CardTitle>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Layers size={16} className="mr-2" />
                    图层
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 800 400">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="absolute inset-0 p-6">
                  {obstacles.map((obstacle, index) => {
                    const x = 50 + (obstacle.longitude - 121.43) * 1500;
                    const y = 50 + (31.25 - obstacle.latitude) * 4000;
                    const colors: Record<string, string> = {
                      normal: 'bg-emerald-500',
                      warning: 'bg-amber-500',
                      overheight: 'bg-red-500',
                    };
                    return (
                      <div
                        key={obstacle.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{ left: `${x}px`, top: `${y}px` }}
                      >
                        <div className={`relative`}>
                          <div className={`w-4 h-4 rounded-full ${colors[obstacle.status]} ring-4 ring-white/20 animate-pulse`} />
                          <MapPin
                            size={20}
                            className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                              obstacle.status === 'overheight' ? 'text-red-400' :
                              obstacle.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl border border-slate-700">
                          <p className="font-medium">{obstacle.name}</p>
                          <p className="text-slate-400">{getObstacleTypeName(obstacle.type)} · {obstacle.height}m</p>
                        </div>
                      </div>
                    );
                  })}

                  {mockRiskHotspots.map((hotspot) => {
                    const x = 50 + (hotspot.longitude - 121.43) * 1500;
                    const y = 50 + (31.25 - hotspot.latitude) * 4000;
                    const sizes: Record<string, string> = {
                      low: 'w-16 h-16',
                      medium: 'w-24 h-24',
                      high: 'w-32 h-32',
                    };
                    const opacities: Record<string, string> = {
                      low: 'bg-red-500/10',
                      medium: 'bg-red-500/20',
                      high: 'bg-red-500/30',
                    };
                    return (
                      <div
                        key={hotspot.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${x}px`, top: `${y}px` }}
                      >
                        <div className={`${sizes[hotspot.riskLevel]} ${opacities[hotspot.riskLevel]} rounded-full blur-xl`} />
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-4 right-4 flex gap-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300">正常</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-300">预警</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-slate-300">超高</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30 blur-sm" />
                    <span className="text-xs text-slate-300">风险热区</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/obstacles')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <Plus size={20} />
                  </div>
                  <span className="text-sm font-medium text-blue-700">登记障碍物</span>
                </button>
                <button
                  onClick={() => navigate('/patrol-tasks')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-emerald-500 text-white">
                    <ClipboardList size={20} />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">新建任务</span>
                </button>
                <button
                  onClick={() => navigate('/public-report')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-amber-500 text-white">
                    <FileText size={20} />
                  </div>
                  <span className="text-sm font-medium text-amber-700">线索受理</span>
                </button>
                <button
                  onClick={() => navigate('/announcements')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-purple-500 text-white">
                    <FileText size={20} />
                  </div>
                  <span className="text-sm font-medium text-purple-700">发布公告</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>任务完成率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="12"
                      strokeDasharray={`${statistics.taskCompletionRate * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{statistics.taskCompletionRate}%</span>
                    <span className="text-xs text-gray-500">完成率</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{statistics.completedTasks}</p>
                  <p className="text-xs text-gray-500">已完成</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{statistics.inProgressTasks}</p>
                  <p className="text-xs text-gray-500">进行中</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近巡查任务</CardTitle>
              <button
                onClick={() => navigate('/patrol-tasks')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                查看全部
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patrolTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/patrol-tasks')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      task.type === 'emergency' ? 'bg-red-100 text-red-600' :
                      task.type === 'special' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">执行人：{task.assignee} · {formatDate(task.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusTag status={task.status} type="task" />
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>超高预警列表</CardTitle>
              <button
                onClick={() => navigate('/inspection')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                查看全部
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {obstacles.filter(o => o.status !== 'normal').slice(0, 4).map((obstacle) => (
                <div
                  key={obstacle.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/obstacles')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      obstacle.status === 'overheight' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{obstacle.name}</p>
                      <p className="text-sm text-gray-500">{getObstacleTypeName(obstacle.type)} · 高度 {obstacle.height}m</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusTag status={obstacle.status} />
                    <StatusTag status={obstacle.riskLevel} type="risk" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
