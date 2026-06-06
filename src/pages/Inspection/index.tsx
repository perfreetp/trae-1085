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

  const overheightObstacles = useMemo(() =>
    obstacles.filter(o => o.status === 'overheight' || o.status === 'warning'),
  [obstacles]);

  const stats = useMemo(() => ({
    overheight: obstacles.filter(o => o.status === 'overheight').length,
    warning: obstacles.filter(o => o.status === 'warning').length,
    rectifying: rectificationNotices.filter(n => n.status === 'rectifying' || n.status === 'issued').length,
    completed: rectificationNotices.filter(n => n.status === 'completed').length,
  }), [obstacles, rectificationNotices]);

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

  const handleConfirmReceive = (id: string) => {
    confirmReceive(id);
  };

  const handleRequestRecheck = (id: string) => {
    requestRecheck(id);
  };

  const handleOpenRecheckModal = (notice: RectificationNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotice(notice);
    setRecheckResult('');
    setShowRecheckModal(true);
  };

  const handlePassRecheck = () => {
    if (selectedNotice && recheckResult) {
      passRecheck(selectedNotice.id, recheckResult);
      setShowRecheckModal(false);
      setShowDetailModal(false);
      setSelectedNotice(null);
      setRecheckResult('');
    }
  };

  const handleReturnRectification = (id: string) => {
    returnRectification(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">核查处置</h1>
          <p className="mt-1 text-sm text-gray-500">超高预警、整改通知和复查销号管理</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              {rectificationNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewDetail(notice)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        notice.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        notice.status === 'overdue' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <FileCheck size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                          <StatusTag status={notice.status} type="rectification" />
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
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            截止：{formatDate(notice.deadline)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            下发：{formatDate(notice.issueTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      {notice.status === 'issued' && (
                        <Button size="sm" onClick={() => handleConfirmReceive(notice.id)}>
                          确认接收
                        </Button>
                      )}
                      {notice.status === 'rectifying' && (
                        <Button size="sm" onClick={() => handleRequestRecheck(notice.id)}>
                          申请复查
                        </Button>
                      )}
                      {notice.status === 'rechecking' && (
                        <Button size="sm" variant="success" onClick={(e) => handleOpenRecheckModal(notice, e)}>
                          <Check size={14} className="mr-1" /> 通过销号
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {rectificationNotices.length === 0 && (
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
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  <FileCheck size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentNotice.title}</h3>
                  <StatusTag status={currentNotice.status} type="rectification" />
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
                  <p className={`font-medium ${currentNotice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
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
              </div>

              {currentNotice.recheckResult && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">复查结果</p>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700">{currentNotice.recheckResult}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {currentNotice.status === 'rechecking' && (
                <>
                  <Button variant="danger" onClick={() => { handleReturnRectification(currentNotice.id); setShowDetailModal(false); }}>退回整改</Button>
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
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowRecheckModal(false); setRecheckResult(''); }}>取消</Button>
              <Button variant="success" onClick={handlePassRecheck} disabled={!recheckResult}>确认通过</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspection;
