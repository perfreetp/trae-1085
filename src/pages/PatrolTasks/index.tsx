import React, { useState } from 'react';
import {
  Plus,
  Search,
  ClipboardList,
  MapPin,
  User,
  Clock,
  Calendar,
  MoreHorizontal,
  Eye,
  Play,
  Check,
  AlertTriangle,
  X,
  Route,
  Map,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { mockPatrolTasks } from '@/data/tasks';
import type { PatrolTask } from '@/types';
import { getTaskTypeName, formatDate, formatDateTime } from '@/utils/helpers';

const PatrolTasks: React.FC = () => {
  const [tasks, setTasks] = useState<PatrolTask[]>(mockPatrolTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PatrolTask | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (task: PatrolTask) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine': return <ClipboardList size={20} />;
      case 'special': return <AlertTriangle size={20} />;
      case 'emergency': return <AlertTriangle size={20} className="text-red-500" />;
      default: return <ClipboardList size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">巡查任务</h1>
          <p className="mt-1 text-sm text-gray-500">管理巡查任务，安排路线和现场核查</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          新建任务
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待处理</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">进行中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Play size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已完成</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <Check size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总任务数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
                <ClipboardList size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜索任务名称、执行人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-64 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">全部状态</option>
                <option value="pending">待处理</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              共 <span className="font-semibold text-gray-900">{filteredTasks.length}</span> 条记录
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleViewDetail(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      task.type === 'emergency' ? 'bg-red-100 text-red-600' :
                      task.type === 'special' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {getTypeIcon(task.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <StatusTag status={task.status} type="task" />
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          执行人：{task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(task.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Route size={14} />
                          {task.routePoints.length} 个巡查点
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {getTaskTypeName(task.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>进度</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">任务详情</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${
                  selectedTask.type === 'emergency' ? 'bg-red-100 text-red-600' :
                  selectedTask.type === 'special' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <ClipboardList size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag status={selectedTask.status} type="task" />
                    <span className="text-sm text-gray-500">{getTaskTypeName(selectedTask.type)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">执行人</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">开始时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedTask.startTime)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">任务描述</p>
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-900">巡查路线</p>
                  <span className="text-sm text-gray-500">
                    {selectedTask.routePoints.filter(p => p.checked).length}/{selectedTask.routePoints.length} 已完成
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedTask.routePoints.map((point, index) => (
                    <div
                      key={point.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        point.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        point.checked ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {point.checked ? <Check size={16} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{point.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                        </p>
                      </div>
                      {point.checkTime && (
                        <span className="text-sm text-emerald-600">
                          {formatDateTime(point.checkTime)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {selectedTask.status === 'pending' && <Button>开始任务</Button>}
              {selectedTask.status === 'in_progress' && <Button>继续巡查</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrolTasks;
