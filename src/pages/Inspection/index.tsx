import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  FileCheck,
  Building2,
  MapPin,
  Calendar,
  User,
  Phone,
  Clock,
  Check,
  X,
  Eye,
  Send,
  Filter,
  RefreshCw,
  History,
  Bell,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store/useAppStore';
import type { RectificationNotice, Obstacle } from '@/types';
import { formatDate, formatDateTime, getObstacleTypeName } from '@/utils/helpers';

const Inspection: React.FC = () => {
  const {
    obstacles,
    rectificationNotices,
    addRectificationNotice,
    confirmReceive,
    requestRecheck,
    passRecheck,
    returnRectification,
    urgeRectification,
    currentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'warnings' | 'rectifications'>('warnings');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<RectificationNotice | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedObstacle, setSelectedObstacle] = useState<Obstacle | null>(null);
  const [issueForm, setIssueForm] = useState({
    title: '',
    content: '',
    deadline: '',
  });
  const [recheckResult, setRecheckResult] = useState('');
  const [showRecheckModal, setShowRecheckModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [receiveRemark, setReceiveRemark] = useState('');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [recheckRemark, setRecheckRemark] = useState('');
  const [showRecheckRequestModal, setShowRecheckRequestModal] = useState(false);
  const [urgeContent, setUrgeContent] = useState('');
  const [showUrgeModal, setShowUrgeModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [unitFilter, setUnitFilter] = useState<string>('');
  const [deadlineStart, setDeadlineStart] = useState<string>('');
  const [deadlineEnd, setDeadlineEnd] = useState<string>('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const overheightObstacles = useMemo(() =>
    obstacles.filter(o => o.status === 'overheight' || o.status === 'warning'),
  [obstacles]);

  const isOverdue = (notice: RectificationNotice): boolean => {
    const deadline = new Date(notice.deadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return deadline < now && notice.status !== 'completed';
  };

  const stats = useMemo(() => ({
    overheight: obstacles.filter(o => o.status === 'overheight').length,
    warning: obstacles.filter(o => o.status === 'warning').length,
    rectifying: rectificationNotices.filter(n => n.status === 'rectifying' || n.status === 'issued').length,
    completed: rectificationNotices.filter(n => n.status === 'completed').length,
    overdue: rectificationNotices.filter(n => isOverdue(n)).length,
  }), [obstacles, rectificationNotices]);

  const responsibleUnits = useMemo(() => {
    const units = new Set(rectificationNotices.map(n => n.responsibleUnit));
    return Array.from(units);
  }, [rectificationNotices]);

  const filteredNotices = useMemo(() => {
    return rectificationNotices.filter(notice => {
      if (showOverdueOnly && !isOverdue(notice)) return false;
      if (statusFilter && notice.status !== statusFilter) return false;
      if (unitFilter && notice.responsibleUnit !== unitFilter) return false;
      if (deadlineStart && new Date(notice.deadline) < new Date(deadlineStart)) return false;
      if (deadlineEnd) {
        const end = new Date(deadlineEnd);
        end.setHours(23, 59, 59, 999);
        if (new Date(notice.deadline) > end) return false;
      }
      return true;
    });
  }, [rectificationNotices, statusFilter, unitFilter, deadlineStart, deadlineEnd, showOverdueOnly]);

  const currentNotice = useMemo(() =>
    selectedNotice ? rectificationNotices.find(n => n.id === selectedNotice.id) || null : null,
  [rectificationNotices, selectedNotice]);

  const handleViewDetail = (notice: RectificationNotice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  const handleOpenIssueModal = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setIssueForm({
      title: `关于${obstacle.name}的整改通知`,
      content: `经核查，贵单位所属${obstacle.name}存在安全隐患，请限期整改。`,
      deadline: '',
    });
    setShowIssueModal(true);
  };

  const handleIssueNotice = () => {
    if (selectedObstacle && issueForm.title && issueForm.content && issueForm.deadline) {
      addRectificationNotice({
        obstacleId: selectedObstacle.id,
        obstacleName: selectedObstacle.name,
        title: issueForm.title,
        content: issueForm.content,
        responsibleUnit: selectedObstacle.ownerUnit,
        contactPerson: selectedObstacle.contactPerson,
        contactPhone: selectedObstacle.contactPhone,
        deadline: issueForm.deadline,
        status: 'issued',
        issueTime: new Date().toISOString(),
        photos: [],
      });
      setShowIssueModal(false);
      setSelectedObstacle(null);
      setIssueForm({ title: '', content: '', deadline: '' });
      setActiveTab('rectifications');
    }
  };

  const handleOpenReceiveModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setReceiveRemark('');
    setShowReceiveModal(true);
  };

  const handleConfirmReceive = () => {
    if (selectedNotice && currentUser) {
      confirmReceive(selectedNotice.id, currentUser.name, receiveRemark);
      setShowReceiveModal(false);
      setSelectedNotice(null);
      setReceiveRemark('');
    }
  };

  const handleOpenRecheckRequestModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setRecheckRemark('');
    setShowRecheckRequestModal(true);
  };

  const handleRequestRecheck = () => {
    if (selectedNotice && currentUser) {
      requestRecheck(selectedNotice.id, currentUser.name, recheckRemark);
      setShowRecheckRequestModal(false);
      setSelectedNotice(null);
      setRecheckRemark('');
    }
  };

  const handleOpenUrgeModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setUrgeContent('');
    setShowUrgeModal(true);
  };

  const handleUrgeRectification = () => {
    if (selectedNotice && urgeContent && currentUser) {
      urgeRectification(selectedNotice.id, urgeContent, currentUser.name);
      setShowUrgeModal(false);
      setSelectedNotice(null);
      setUrgeContent('');
    }
  };

  const handleOpenRecheckModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setRecheckResult('');
    setShowRecheckModal(true);
  };

  const handlePassRecheck = () => {
    if (selectedNotice && recheckResult && currentUser) {
      passRecheck(selectedNotice.id, recheckResult, currentUser.name);
      setShowRecheckModal(false);
      setShowDetailModal(false);
      setSelectedNotice(null);
      setRecheckResult('');
    }
  };

  const handleOpenReturnModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const handleReturnRectification = () => {
    if (selectedNotice && returnReason && currentUser) {
      returnRectification(selectedNotice.id, returnReason, currentUser.name);
      setShowReturnModal(false);
      setShowDetailModal(false);
      setSelectedNotice(null);
      setReturnReason('');
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setUnitFilter('');
    setDeadlineStart('');
    setDeadlineEnd('');
    setShowOverdueOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">核查处置</h1>
          <p className="mt-1 text-sm text-gray-500">超高预警、整改通知和复查销号管理</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">超高预警</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.overheight}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">预警提醒</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.warning}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">整改中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.rectifying}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <FileCheck size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">逾期整改</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已完成整改</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <Check size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('warnings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'warnings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} />
                超高预警
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rectifications')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'rectifications'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck size={18} />
                整改通知
              </div>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'warnings' && (
            <div className="space-y-4">
              {overheightObstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className="p-5 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        obstacle.status === 'overheight' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{obstacle.name}</h3>
                          <StatusTag status={obstacle.status} />
                          <StatusTag status={obstacle.riskLevel} type="risk" />
                        </div>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">类型：</span>
                            <span className="font-medium text-gray-900">{getObstacleTypeName(obstacle.type)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">高度：</span>
                            <span className={`font-bold ${
                              obstacle.status === 'overheight' ? 'text-red-600' : 'text-amber-600'
                            }`}>{obstacle.height}m</span>
                          </div>
                          <div>
                            <span className="text-gray-500">责任单位：</span>
                            <span className="font-medium text-gray-900">{obstacle.ownerUnit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">联系人：</span>
                            <span className="font-medium text-gray-900">{obstacle.contactPerson}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          {obstacle.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="secondary">
                        <Eye size={14} className="mr-1" /> 查看
                      </Button>
                      <Button size="sm" onClick={() => handleOpenIssueModal(obstacle)}>
                        <Send size={14} className="mr-1" /> 下发整改
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {overheightObstacles.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>暂无超高预警记录</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rectifications' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={18} className="text-gray-500" />
                  <span className="font-medium text-gray-700">筛选条件</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">状态</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">全部状态</option>
                      <option value="issued">已下发</option>
                      <option value="rectifying">整改中</option>
                      <option value="rechecking">复查中</option>
                      <option value="completed">已完成</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">责任单位</label>
                    <select
                      value={unitFilter}
                      onChange={(e) => setUnitFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">全部单位</option>
                      {responsibleUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">截止日期起</label>
                    <input
                      type="date"
                      value={deadlineStart}
                      onChange={(e) => setDeadlineStart(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">截止日期止</label>
                    <input
                      type="date"
                      value={deadlineEnd}
                      onChange={(e) => setDeadlineEnd(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      variant={showOverdueOnly ? 'danger' : 'secondary'}
                      onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                      className="flex-1"
                    >
                      <AlertTriangle size={14} className="mr-1" />
                      {showOverdueOnly ? '取消筛选' : '一键查看逾期'}
                    </Button>
                    <Button variant="secondary" onClick={handleResetFilters}>
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {filteredNotices.map((notice) => {
                const overdue = isOverdue(notice);
                return (
                  <div
                    key={notice.id}
                    className={`p-5 rounded-xl border hover:shadow-sm transition-all cursor-pointer ${
                      overdue
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-gray-100 hover:border-blue-200'
                    }`}
                    onClick={() => handleViewDetail(notice)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${
                          notice.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                          overdue ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <FileCheck size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                            <StatusTag status={overdue ? 'overdue' : notice.status} type="rectification" />
                            {overdue && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                <AlertTriangle size={12} className="mr-1" />
                                已逾期
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{notice.content}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Building2 size={14} />
                              {notice.obstacleName}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {notice.responsibleUnit}
                            </span>
                            <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
                              <Calendar size={14} />
                              截止：{formatDate(notice.deadline)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              下发：{formatDate(notice.issueTime)}
                            </span>
                            {notice.lastUrgeTime && (
                              <span className="flex items-center gap-1 text-amber-600">
                                <Bell size={14} />
                                最近催办：{formatDateTime(notice.lastUrgeTime)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                        {notice.status === 'issued' && (
                          <Button size="sm" onClick={(e) => handleOpenReceiveModal(notice, e)}>
                            确认接收
                          </Button>
                        )}
                        {notice.status === 'rectifying' && (
                          <Button size="sm" onClick={(e) => handleOpenRecheckRequestModal(notice, e)}>
                            申请复查
                          </Button>
                        )}
                        {notice.status === 'rechecking' && (
                          <>
                            <Button size="sm" variant="danger" onClick={(e) => handleOpenReturnModal(notice, e)}>
                              退回整改
                            </Button>
                            <Button size="sm" variant="success" onClick={(e) => handleOpenRecheckModal(notice, e)}>
                              <Check size={14} className="mr-1" /> 通过销号
                            </Button>
                          </>
                        )}
                        {notice.status !== 'completed' && !overdue && (
                          <Button size="sm" variant="warning" onClick={(e) => handleOpenUrgeModal(notice, e)}>
                            <Bell size={14} className="mr-1" /> 催办
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredNotices.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <FileCheck size={48} className="mx-auto mb-4 opacity-50" />
                  <p>暂无整改通知记录</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showDetailModal && currentNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">整改通知详情</h2>
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
                  currentNotice.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                  isOverdue(currentNotice) ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <FileCheck size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentNotice.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag status={isOverdue(currentNotice) ? 'overdue' : currentNotice.status} type="rectification" />
                    {isOverdue(currentNotice) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        <AlertTriangle size={12} className="mr-1" />
                        已逾期
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">整改内容</p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700">{currentNotice.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">关联障碍物</p>
                  <p className="font-medium text-gray-900">{currentNotice.obstacleName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">责任单位</p>
                  <p className="font-medium text-gray-900">{currentNotice.responsibleUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">联系人</p>
                  <p className="font-medium text-gray-900">{currentNotice.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">联系电话</p>
                  <p className="font-medium text-gray-900">{currentNotice.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">下发时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(currentNotice.issueTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">整改截止</p>
                  <p className={`font-medium ${isOverdue(currentNotice) ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(currentNotice.deadline)}
                  </p>
                </div>
                {currentNotice.rectificationTime && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">接收时间</p>
                    <p className="font-medium text-gray-900">{formatDateTime(currentNotice.rectificationTime)}</p>
                  </div>
                )}
                {currentNotice.recheckTime && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">复查时间</p>
                    <p className="font-medium text-gray-900">{formatDateTime(currentNotice.recheckTime)}</p>
                  </div>
                )}
                {currentNotice.returnTime && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">退回时间</p>
                      <p className="font-medium text-red-600">{formatDateTime(currentNotice.returnTime)}</p>
                    </div>
                  </>
                )}
              </div>

              {currentNotice.returnReason && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">退回原因</p>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <p className="text-red-700">{currentNotice.returnReason}</p>
                  </div>
                </div>
              )}

              {currentNotice.recheckResult && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">复查结果</p>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700">{currentNotice.recheckResult}</p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <History size={18} className="text-gray-500" />
                  <p className="font-medium text-gray-700">流转时间线</p>
                </div>
                <div className="relative">
                  {currentNotice.flowRecords.map((record, index) => (
                    <div key={record.id} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          record.action === 'urge' ? 'bg-amber-500' :
                          index === 0 ? 'bg-blue-500' :
                          index === currentNotice.flowRecords.length - 1 ? 'bg-emerald-500' :
                          'bg-gray-400'
                        }`} />
                        {index < currentNotice.flowRecords.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-1 ${
                            record.action === 'urge' ? 'bg-amber-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${
                            record.action === 'urge' ? 'text-amber-700' : 'text-gray-900'
                          }`}>{record.actionName}</p>
                          <span className="text-xs text-gray-500">{formatDateTime(record.operateTime)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">操作人：{record.operator}</p>
                        {record.remark && (
                          <p className={`text-sm mt-1 p-2 rounded-lg ${
                            record.action === 'urge' 
                              ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                              : 'text-gray-600 bg-gray-50'
                          }`}>
                            {record.remark}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentNotice.urgeRecords && currentNotice.urgeRecords.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={18} className="text-amber-500" />
                    <p className="font-medium text-gray-700">催办记录</p>
                  </div>
                  <div className="space-y-3">
                    {currentNotice.urgeRecords.map((record) => (
                      <div key={record.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-amber-800">催办</p>
                          <span className="text-xs text-amber-600">{formatDateTime(record.urgeTime)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">操作人：{record.operator}</p>
                        <p className="text-sm text-amber-700">{record.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {currentNotice.status === 'rechecking' && (
                <>
                  <Button variant="danger" onClick={(e) => handleOpenReturnModal(currentNotice, e as any)}>退回整改</Button>
                  <Button variant="success" onClick={() => { setShowRecheckModal(true); }}>通过销号</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showIssueModal && selectedObstacle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">下发整改通知</h2>
              <button
                onClick={() => { setShowIssueModal(false); setSelectedObstacle(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">整改对象：</span>{selectedObstacle.name}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  责任单位：{selectedObstacle.ownerUnit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">通知标题</label>
                <input
                  type="text"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">整改内容</label>
                <textarea
                  value={issueForm.content}
                  onChange={(e) => setIssueForm(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">整改截止日期</label>
                <input
                  type="date"
                  value={issueForm.deadline}
                  onChange={(e) => setIssueForm(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowIssueModal(false); setSelectedObstacle(null); }}>取消</Button>
              <Button onClick={handleIssueNotice} disabled={!issueForm.title || !issueForm.content || !issueForm.deadline}>确认下发</Button>
            </div>
          </div>
        </div>
      )}

      {showRecheckModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">复查通过</h2>
              <button
                onClick={() => { setShowRecheckModal(false); setRecheckResult(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">复查结果</label>
                <textarea
                  value={recheckResult}
                  onChange={(e) => setRecheckResult(e.target.value)}
                  rows={4}
                  placeholder="请填写复查结果说明..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                操作人：<span className="font-medium text-gray-700">{currentUser?.name}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowRecheckModal(false); setRecheckResult(''); }}>取消</Button>
              <Button variant="success" onClick={handlePassRecheck} disabled={!recheckResult}>确认通过</Button>
            </div>
          </div>
        </div>
      )}

      {showReturnModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">退回整改</h2>
              <button
                onClick={() => { setShowReturnModal(false); setReturnReason(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">退回原因</label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={4}
                  placeholder="请填写退回原因说明..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                操作人：<span className="font-medium text-gray-700">{currentUser?.name}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowReturnModal(false); setReturnReason(''); }}>取消</Button>
              <Button variant="danger" onClick={handleReturnRectification} disabled={!returnReason}>确认退回</Button>
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">确认接收</h2>
              <button
                onClick={() => { setShowReceiveModal(false); setReceiveRemark(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
                <textarea
                  value={receiveRemark}
                  onChange={(e) => setReceiveRemark(e.target.value)}
                  rows={3}
                  placeholder="请填写接收备注..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                操作人：<span className="font-medium text-gray-700">{currentUser?.name}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowReceiveModal(false); setReceiveRemark(''); }}>取消</Button>
              <Button onClick={handleConfirmReceive}>确认接收</Button>
            </div>
          </div>
        </div>
      )}

      {showRecheckRequestModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">申请复查</h2>
              <button
                onClick={() => { setShowRecheckRequestModal(false); setRecheckRemark(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
                <textarea
                  value={recheckRemark}
                  onChange={(e) => setRecheckRemark(e.target.value)}
                  rows={3}
                  placeholder="请填写整改说明..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                操作人：<span className="font-medium text-gray-700">{currentUser?.name}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowRecheckRequestModal(false); setRecheckRemark(''); }}>取消</Button>
              <Button onClick={handleRequestRecheck}>申请复查</Button>
            </div>
          </div>
        </div>
      )}

      {showUrgeModal && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">催办整改</h2>
              <button
                onClick={() => { setShowUrgeModal(false); setUrgeContent(''); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">整改通知：</span>{selectedNotice.title}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  责任单位：{selectedNotice.responsibleUnit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">催办内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={urgeContent}
                  onChange={(e) => setUrgeContent(e.target.value)}
                  rows={4}
                  placeholder="请填写催办内容说明..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                操作人：<span className="font-medium text-gray-700">{currentUser?.name}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowUrgeModal(false); setUrgeContent(''); }}>取消</Button>
              <Button variant="warning" onClick={handleUrgeRectification} disabled={!urgeContent}>确认催办</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspection;
