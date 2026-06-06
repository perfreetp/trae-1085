import React, { useState, useMemo } from 'react';
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
  Camera,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store/useAppStore';
import type { PatrolTask, RoutePoint } from '@/types';
import { getTaskTypeName, formatDate, formatDateTime } from '@/utils/helpers';

interface NewRoutePoint {
  name: string;
  latitude: number;
  longitude: number;
}

const PatrolTasksPage: React.FC = () => {
  const { patrolTasks, addPatrolTask, startTask, checkRoutePoint } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PatrolTask | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPatrolModal, setShowPatrolModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [patrolRemark, setPatrolRemark] = useState('');
  const [patrolPhotos, setPatrolPhotos] = useState<string[]>([]);

  const [createForm, setCreateForm] = useState({
    title: '',
    type: 'routine' as 'routine' | 'special' | 'emergency',
    assignee: '',
    startTime: '',
    description: '',
    routePoints: [] as NewRoutePoint[],
  });

  const stats = useMemo(() => ({
    pending: patrolTasks.filter(t => t.status === 'pending').length,
    inProgress: patrolTasks.filter(t => t.status === 'in_progress').length,
    completed: patrolTasks.filter(t => t.status === 'completed').length,
    total: patrolTasks.length,
  }), [patrolTasks]);

  const filteredTasks = useMemo(() => patrolTasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  }), [patrolTasks, searchTerm, statusFilter]);

  const currentTask = useMemo(() =>
    selectedTask ? patrolTasks.find(t => t.id === selectedTask.id) || null : null,
  [patrolTasks, selectedTask]);

  const handleViewDetail = (task: PatrolTask) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleOpenCreateModal = () => {
    setCreateForm({
      title: '',
      type: 'routine',
      assignee: '',
      startTime: '',
      description: '',
      routePoints: [],
    });
    setShowCreateModal(true);
  };

  const handleAddRoutePoint = () => {
    setCreateForm(f => ({
      ...f,
      routePoints: [...f.routePoints, { name: '', latitude: 31.2, longitude: 121.5 }],
    }));
  };

  const handleUpdateRoutePoint = (index: number, field: keyof NewRoutePoint, value: string | number) => {
    setCreateForm(f => ({
      ...f,
      routePoints: f.routePoints.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleRemoveRoutePoint = (index: number) => {
    setCreateForm(f => ({
      ...f,
      routePoints: f.routePoints.filter((_, i) => i !== index),
    }));
  };

  const handleCreateTask = () => {
    if (createForm.title && createForm.assignee && createForm.startTime && createForm.routePoints.length > 0) {
      const routePoints: RoutePoint[] = createForm.routePoints.map((p, i) => ({
        id: `p${Date.now()}-${i}`,
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        order: i + 1,
        checked: false,
      }));

      addPatrolTask({
        title: createForm.title,
        type: createForm.type,
        status: 'pending',
        assignee: createForm.assignee,
        routePoints,
        startTime: new Date(createForm.startTime).toISOString(),
        description: createForm.description,
      });
      setShowCreateModal(false);
    }
  };

  const handleStartTask = (id: string) => {
    startTask(id);
  };

  const handleOpenPatrolModal = (point: RoutePoint) => {
    setSelectedPoint(point);
    setPatrolRemark('');
    setPatrolPhotos([]);
    setShowPatrolModal(true);
  };

  const handleCheckPoint = () => {
    if (currentTask && selectedPoint) {
      checkRoutePoint(currentTask.id, selectedPoint.id, patrolPhotos, patrolRemark);
      setShowPatrolModal(false);
      setSelectedPoint(null);
      setPatrolRemark('');
      setPatrolPhotos([]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(f => URL.createObjectURL(f));
      setPatrolPhotos(prev => [...prev, ...newPhotos]);
    }
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
        <Button onClick={handleOpenCreateModal}>
          <Plus size={18} className="mr-2" />
          新建任务
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待处理</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
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
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
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
                      <div className="flex items-center gap-3 flex-wrap">
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
                    {task.status === 'pending' && (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleStartTask(task.id); }}>
                        <Play size={14} className="mr-1" /> 开始任务
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTask(task); setShowDetailModal(true); }}>
                        <Eye size={14} className="mr-1" /> 继续巡查
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无巡查任务</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && currentTask && (
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
                  currentTask.type === 'emergency' ? 'bg-red-100 text-red-600' :
                  currentTask.type === 'special' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <ClipboardList size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentTask.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag status={currentTask.status} type="task" />
                    <span className="text-sm text-gray-500">{getTaskTypeName(currentTask.type)}</span>
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
                    <span className="font-medium text-gray-900">{currentTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">开始时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(currentTask.startTime)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">任务描述</p>
                <p className="text-gray-700">{currentTask.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-900">巡查路线</p>
                  <span className="text-sm text-gray-500">
                    {currentTask.routePoints.filter(p => p.checked).length}/{currentTask.routePoints.length} 已完成
                  </span>
                </div>
                <div className="space-y-2">
                  {currentTask.routePoints.map((point, index) => (
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
                        {point.remark && (
                          <p className="text-sm text-gray-600 mt-1">备注：{point.remark}</p>
                        )}
                        {point.photos && point.photos.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {point.photos.map((photo, i) => (
                              <div key={i} className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {point.checkTime ? (
                        <span className="text-sm text-emerald-600">
                          {formatDateTime(point.checkTime)}
                        </span>
                      ) : currentTask.status === 'in_progress' ? (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); handleOpenPatrolModal(point); }}>
                          <Check size={14} className="mr-1" /> 打卡
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {currentTask.status === 'pending' && (
                <Button onClick={() => { handleStartTask(currentTask.id); }}>开始任务</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">新建巡查任务</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="请输入任务名称"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">任务类型</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm(f => ({ ...f, type: e.target.value as 'routine' | 'special' | 'emergency' }))}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="routine">例行巡查</option>
                    <option value="special">专项核查</option>
                    <option value="emergency">紧急任务</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">执行人</label>
                  <input
                    type="text"
                    value={createForm.assignee}
                    onChange={(e) => setCreateForm(f => ({ ...f, assignee: e.target.value }))}
                    placeholder="请输入执行人姓名"
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                <input
                  type="datetime-local"
                  value={createForm.startTime}
                  onChange={(e) => setCreateForm(f => ({ ...f, startTime: e.target.value }))}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">任务描述</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="请输入任务描述..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">巡查点</label>
                  <Button size="sm" variant="outline" onClick={handleAddRoutePoint}>
                    <Plus size={14} className="mr-1" /> 添加巡查点
                  </Button>
                </div>
                <div className="space-y-3">
                  {createForm.routePoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={point.name}
                          onChange={(e) => handleUpdateRoutePoint(index, 'name', e.target.value)}
                          placeholder="巡查点名称"
                          className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            step="0.0001"
                            value={point.latitude}
                            onChange={(e) => handleUpdateRoutePoint(index, 'latitude', parseFloat(e.target.value))}
                            placeholder="纬度"
                            className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="number"
                            step="0.0001"
                            value={point.longitude}
                            onChange={(e) => handleUpdateRoutePoint(index, 'longitude', parseFloat(e.target.value))}
                            placeholder="经度"
                            className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRoutePoint(index)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {createForm.routePoints.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      点击上方"添加巡查点"按钮添加
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>取消</Button>
              <Button
                onClick={handleCreateTask}
                disabled={!createForm.title || !createForm.assignee || !createForm.startTime || createForm.routePoints.length === 0}
              >
                <Send size={16} className="mr-2" />
                创建任务
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPatrolModal && selectedPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">巡查打卡</h2>
              <button
                onClick={() => setShowPatrolModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-medium text-gray-900">{selectedPoint.name}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">现场备注</label>
                <textarea
                  value={patrolRemark}
                  onChange={(e) => setPatrolRemark(e.target.value)}
                  rows={3}
                  placeholder="请输入现场情况说明..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">现场照片</label>
                <div className="grid grid-cols-4 gap-2">
                  {patrolPhotos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPatrolPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Camera size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">上传照片</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowPatrolModal(false)}>取消</Button>
              <Button onClick={handleCheckPoint}>
                <Check size={16} className="mr-2" />
                确认打卡
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrolTasksPage;
