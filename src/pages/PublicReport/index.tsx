import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  MapPin,
  User,
  Phone,
  Clock,
  Check,
  X,
  Merge,
  Eye,
  FileText,
  ClipboardList,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store/useAppStore';
import type { PublicReport, PatrolTask } from '@/types';
import { formatDate, formatDateTime } from '@/utils/helpers';

const PublicReportPage: React.FC = () => {
  const { publicReports, patrolTasks, approveReport, rejectReport, mergeReport, createTaskFromReport } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeSource, setMergeSource] = useState<string | null>(null);
  const [mergeTarget, setMergeTarget] = useState<string>('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskSourceId, setTaskSourceId] = useState<string | null>(null);
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskStartTime, setTaskStartTime] = useState<string>('');
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [relatedTask, setRelatedTask] = useState<PatrolTask | null>(null);

  const stats = useMemo(() => ({
    pending: publicReports.filter(r => r.status === 'pending').length,
    reviewing: publicReports.filter(r => r.status === 'reviewing').length,
    processing: publicReports.filter(r => r.status === 'processing').length,
    completed: publicReports.filter(r => r.status === 'completed').length,
    merged: publicReports.filter(r => r.status === 'merged').length,
  }), [publicReports]);

  const filteredReports = useMemo(() => publicReports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [publicReports, searchTerm, statusFilter]);

  const availableMergeTargets = useMemo(() => 
    publicReports.filter(r => 
      r.id !== mergeSource && 
      r.status !== 'merged' && 
      r.status !== 'rejected'
    ), 
  [publicReports, mergeSource]);

  const currentReport = useMemo(() => 
    selectedReport ? publicReports.find(r => r.id === selectedReport.id) || null : null,
  [publicReports, selectedReport]);

  const getRelatedTask = (reportId: string) => {
    const report = publicReports.find(r => r.id === reportId);
    if (!report?.relatedTaskId) return null;
    return patrolTasks.find(t => t.id === report.relatedTaskId) || null;
  };

  const handleViewDetail = (report: PublicReport) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleApprove = (id: string) => {
    approveReport(id);
  };

  const handleReject = (id: string) => {
    rejectReport(id);
  };

  const handleOpenMerge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMergeSource(id);
    setMergeTarget('');
    setShowMergeModal(true);
  };

  const handleConfirmMerge = () => {
    if (mergeSource && mergeTarget) {
      mergeReport(mergeSource, mergeTarget);
      setShowMergeModal(false);
      setMergeSource(null);
      setMergeTarget('');
    }
  };

  const handleOpenCreateTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskSourceId(id);
    setTaskAssignee('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setTaskStartTime(now.toISOString().slice(0, 16));
    setShowTaskModal(true);
  };

  const handleConfirmCreateTask = () => {
    if (taskSourceId && taskAssignee && taskStartTime) {
      createTaskFromReport(taskSourceId, taskAssignee, new Date(taskStartTime).toISOString());
      setShowTaskModal(false);
      setTaskSourceId(null);
      setTaskAssignee('');
      setTaskStartTime('');
    }
  };

  const getMergedTargetTitle = (targetId: string) => {
    const target = publicReports.find(r => r.id === targetId);
    return target?.title || '未知线索';
  };

  const handleViewTaskDetail = (task: PatrolTask) => {
    setRelatedTask(task);
    setShowTaskDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">群众上报</h1>
          <p className="mt-1 text-sm text-gray-500">受理公众上报的线索，进行审核和处理</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
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
                <p className="text-sm text-gray-500">审核中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.reviewing}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Eye size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">处理中</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.processing}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <FileText size={24} />
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
                <p className="text-sm text-gray-500">已合并</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">{stats.merged}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
                <Merge size={24} />
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
                  placeholder="搜索标题、内容..."
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
                <option value="pending">待审核</option>
                <option value="reviewing">审核中</option>
                <option value="processing">处理中</option>
                <option value="merged">已合并</option>
                <option value="completed">已完成</option>
                <option value="rejected">已驳回</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              共 <span className="font-semibold text-gray-900">{filteredReports.length}</span> 条记录
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const relatedTask = getRelatedTask(report.id);
              return (
                <div
                  key={report.id}
                  className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewDetail(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-cyan-100 text-cyan-600">
                        <MessageSquare size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <StatusTag status={report.status} type="report" />
                          {report.status === 'merged' && report.mergedInto && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              合并至：{getMergedTargetTitle(report.mergedInto)}
                            </span>
                          )}
                          {relatedTask && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                              <ClipboardList size={12} />
                              已关联任务
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{report.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {report.reporterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {report.reporterPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="truncate max-w-xs">{report.location.address}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      {report.status === 'pending' && (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleApprove(report.id)}>
                            <Check size={14} className="mr-1" /> 通过
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(report.id)}>
                            <X size={14} className="mr-1" /> 驳回
                          </Button>
                          <Button size="sm" variant="secondary" onClick={(e) => handleOpenMerge(report.id, e)}>
                            <Merge size={14} className="mr-1" /> 合并
                          </Button>
                        </>
                      )}
                      {report.status === 'processing' && !relatedTask && (
                        <Button size="sm" onClick={(e) => handleOpenCreateTask(report.id, e)}>
                          <ClipboardList size={14} className="mr-1" /> 转巡查任务
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && currentReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">线索详情</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-cyan-100 text-cyan-600">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentReport.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StatusTag status={currentReport.status} type="report" />
                    {currentReport.status === 'merged' && currentReport.mergedInto && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        合并至：{getMergedTargetTitle(currentReport.mergedInto)}
                      </span>
                    )}
                    {getRelatedTask(currentReport.id) && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        <ClipboardList size={12} />
                        已关联任务
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">问题描述</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{currentReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <User size={14} /> 上报人
                  </p>
                  <p className="font-medium text-gray-900">{currentReport.reporterName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Phone size={14} /> 联系电话
                  </p>
                  <p className="font-medium text-gray-900">{currentReport.reporterPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin size={14} /> 位置
                  </p>
                  <p className="font-medium text-gray-900">{currentReport.location.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentReport.location.latitude}, {currentReport.location.longitude}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">位置地图</p>
                <div className="h-40 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto text-red-500 mb-2" />
                    <p className="text-sm text-gray-600">位置标记</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">照片凭证</p>
                <div className="grid grid-cols-4 gap-3">
                  {currentReport.photos.length > 0 ? (
                    currentReport.photos.map((photo, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-gray-100 overflow-hidden">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-gray-400 py-8">暂无照片</p>
                  )}
                </div>
              </div>

              {getRelatedTask(currentReport.id) && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <ClipboardList size={16} />
                      关联巡查任务
                    </p>
                    <Button size="sm" variant="secondary" onClick={() => handleViewTaskDetail(getRelatedTask(currentReport.id)!)}>
                      <Eye size={14} className="mr-1" /> 查看关联任务
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <ClipboardList size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900">{getRelatedTask(currentReport.id)?.title}</h4>
                          <StatusTag status={getRelatedTask(currentReport.id)?.status || ''} type="task" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <User size={14} />
                          执行人：{getRelatedTask(currentReport.id)?.assignee}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>巡查进度</span>
                        <span>{getRelatedTask(currentReport.id)?.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            getRelatedTask(currentReport.id)?.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${getRelatedTask(currentReport.id)?.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1">
                          <Calendar size={14} />
                          计划开始时间
                        </p>
                        <p className="font-medium text-gray-900">{formatDateTime(getRelatedTask(currentReport.id)?.startTime || '')}</p>
                      </div>
                      {getRelatedTask(currentReport.id)?.endTime && (
                        <div>
                          <p className="text-gray-500 mb-1 flex items-center gap-1">
                            <Check size={14} />
                            完成时间
                          </p>
                          <p className="font-medium text-gray-900">{formatDateTime(getRelatedTask(currentReport.id)?.endTime || '')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500">
                <span>上报时间：{formatDateTime(currentReport.createdAt)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {currentReport.status === 'pending' && (
                <>
                  <Button variant="danger" onClick={() => { handleReject(currentReport.id); setShowDetailModal(false); }}>驳回</Button>
                  <Button onClick={() => { handleApprove(currentReport.id); setShowDetailModal(false); }}>通过</Button>
                </>
              )}
              {currentReport.status === 'processing' && !getRelatedTask(currentReport.id) && (
                <Button onClick={() => { setShowDetailModal(false); handleOpenCreateTask(currentReport.id, { stopPropagation: () => {} } as React.MouseEvent); }}>
                  转巡查任务
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">合并线索</h2>
              <button
                onClick={() => { setShowMergeModal(false); setMergeSource(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">选择要合并到的目标线索：</p>
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">请选择目标线索</option>
                {availableMergeTargets.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowMergeModal(false); setMergeSource(null); }}>取消</Button>
              <Button onClick={handleConfirmMerge} disabled={!mergeTarget}>确认合并</Button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">转巡查任务</h2>
              <button
                onClick={() => { setShowTaskModal(false); setTaskSourceId(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                  <User size={14} /> 执行人
                </label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">请选择执行人</option>
                  <option value="张巡查">张巡查</option>
                  <option value="李巡查">李巡查</option>
                  <option value="王巡查">王巡查</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                  <Calendar size={14} /> 开始时间
                </label>
                <input
                  type="datetime-local"
                  value={taskStartTime}
                  onChange={(e) => setTaskStartTime(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowTaskModal(false); setTaskSourceId(null); }}>取消</Button>
              <Button onClick={handleConfirmCreateTask} disabled={!taskAssignee || !taskStartTime}>确认生成</Button>
            </div>
          </div>
        </div>
      )}

      {showTaskDetail && relatedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">关联任务详情</h2>
              <button
                onClick={() => { setShowTaskDetail(false); setRelatedTask(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  <ClipboardList size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{relatedTask.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag status={relatedTask.status} type="task" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <User size={14} /> 执行人
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-gray-900">{relatedTask.assignee}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>巡查进度</span>
                  <span className="font-medium text-gray-900">{relatedTask.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      relatedTask.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${relatedTask.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar size={14} /> 开始时间
                  </p>
                  <p className="font-medium text-gray-900">{formatDateTime(relatedTask.startTime)}</p>
                </div>
                {relatedTask.endTime && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Check size={14} /> 完成时间
                    </p>
                    <p className="font-medium text-gray-900">{formatDateTime(relatedTask.endTime)}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">任务描述</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{relatedTask.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowTaskDetail(false); setRelatedTask(null); }}>关闭</Button>
              <Button>
                <Eye size={14} className="mr-1" /> 查看完整任务
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicReportPage;
