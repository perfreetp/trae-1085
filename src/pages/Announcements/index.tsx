import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Bell,
  AlertTriangle,
  FileText,
  Eye,
  Calendar,
  User,
  X,
  Edit,
  Trash2,
  Send,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store/useAppStore';
import type { Announcement } from '@/types';
import { getAnnouncementTypeName, formatDate, formatDateTime } from '@/utils/helpers';

const AnnouncementsPage: React.FC = () => {
  const { announcements, addAnnouncement, publishAnnouncement, deleteAnnouncement, updateAnnouncement, withdrawAnnouncement, scheduleAnnouncement } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    type: 'notice' as 'notice' | 'warning' | 'policy',
    content: '',
    isScheduled: false,
    scheduledPublishTime: '',
  });
  const [publishForm, setPublishForm] = useState({
    title: '',
    type: 'notice' as 'notice' | 'warning' | 'policy',
    content: '',
    isScheduled: false,
    scheduledPublishTime: '',
  });

  useEffect(() => {
    const now = new Date();
    announcements.forEach((announcement) => {
      if (announcement.status === 'scheduled' && announcement.scheduledPublishTime) {
        const scheduledTime = new Date(announcement.scheduledPublishTime);
        if (scheduledTime <= now) {
          publishAnnouncement(announcement.id);
        }
      }
    });
  }, []);

  const getEffectiveStatus = (announcement: Announcement): Announcement['status'] => {
    const now = new Date();
    if (announcement.scheduledPublishTime && new Date(announcement.scheduledPublishTime) <= now) {
      return 'published';
    }
    return announcement.status;
  };

  const stats = useMemo(() => ({
    notice: announcements.filter(a => a.type === 'notice').length,
    warning: announcements.filter(a => a.type === 'warning').length,
    policy: announcements.filter(a => a.type === 'policy').length,
    scheduled: announcements.filter(a => {
      const now = new Date();
      return a.status === 'scheduled' && a.scheduledPublishTime && new Date(a.scheduledPublishTime) > now;
    }).length,
  }), [announcements]);

  const filteredAnnouncements = useMemo(() => announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const effectiveStatus = getEffectiveStatus(a);
    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
    return matchSearch && matchType && matchStatus;
  }), [announcements, searchTerm, typeFilter, statusFilter]);

  const currentAnnouncement = useMemo(() =>
    selectedAnnouncement ? announcements.find(a => a.id === selectedAnnouncement.id) || null : null,
  [announcements, selectedAnnouncement]);

  const handleViewDetail = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  const handleOpenPublishModal = () => {
    setPublishForm({
      title: '',
      type: 'notice',
      content: '',
      isScheduled: false,
      scheduledPublishTime: '',
    });
    setShowPublishModal(true);
  };

  const handlePublishNew = () => {
    if (publishForm.title && publishForm.content) {
      const now = new Date();
      if (publishForm.isScheduled && publishForm.scheduledPublishTime) {
        const scheduledTime = new Date(publishForm.scheduledPublishTime);
        if (scheduledTime <= now) {
          addAnnouncement({
            title: publishForm.title,
            type: publishForm.type,
            content: publishForm.content,
            status: 'published',
            author: '管理员',
            publishTime: scheduledTime.toISOString(),
          });
        } else {
          addAnnouncement({
            title: publishForm.title,
            type: publishForm.type,
            content: publishForm.content,
            status: 'scheduled',
            author: '管理员',
            scheduledPublishTime: scheduledTime.toISOString(),
          });
        }
      } else {
        addAnnouncement({
          title: publishForm.title,
          type: publishForm.type,
          content: publishForm.content,
          status: 'draft',
          author: '管理员',
        });
      }
      setShowPublishModal(false);
    }
  };

  const handlePublishDraft = (id: string) => {
    publishAnnouncement(id);
    setShowDetailModal(false);
  };

  const handlePublishScheduled = (id: string) => {
    publishAnnouncement(id);
    setShowDetailModal(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条公告吗？')) {
      deleteAnnouncement(id);
    }
  };

  const handleOpenEditModal = (announcement: Announcement, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditForm({
      id: announcement.id,
      title: announcement.title,
      type: announcement.type,
      content: announcement.content,
      isScheduled: !!announcement.scheduledPublishTime,
      scheduledPublishTime: announcement.scheduledPublishTime
        ? new Date(announcement.scheduledPublishTime).toISOString().slice(0, 16)
        : '',
    });
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  const handleSaveEdit = () => {
    if (editForm.title && editForm.content) {
      const now = new Date();
      if (editForm.isScheduled && editForm.scheduledPublishTime) {
        const scheduledTime = new Date(editForm.scheduledPublishTime);
        if (scheduledTime <= now) {
          updateAnnouncement(editForm.id, {
            title: editForm.title,
            type: editForm.type,
            content: editForm.content,
            status: 'published',
            publishTime: scheduledTime.toISOString(),
            scheduledPublishTime: undefined,
          });
        } else {
          updateAnnouncement(editForm.id, {
            title: editForm.title,
            type: editForm.type,
            content: editForm.content,
            status: 'scheduled',
            scheduledPublishTime: scheduledTime.toISOString(),
            publishTime: undefined,
          });
        }
      } else {
        updateAnnouncement(editForm.id, {
          title: editForm.title,
          type: editForm.type,
          content: editForm.content,
          status: 'draft',
          scheduledPublishTime: undefined,
          publishTime: undefined,
        });
      }
      setShowEditModal(false);
    }
  };

  const handleWithdraw = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('确定要撤回这条公告吗？撤回后将变为草稿状态。')) {
      withdrawAnnouncement(id);
      setShowDetailModal(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notice': return <Bell size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'policy': return <FileText size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notice': return 'bg-blue-100 text-blue-600';
      case 'warning': return 'bg-amber-100 text-amber-600';
      case 'policy': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公告管理</h1>
          <p className="mt-1 text-sm text-gray-500">发布和管理通知公告、预警提示和政策法规</p>
        </div>
        <Button onClick={handleOpenPublishModal}>
          <Plus size={18} className="mr-2" />
          发布公告
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">通知公告</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.notice}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Bell size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">预警提示</p>
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
                <p className="text-sm text-gray-500">政策法规</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.policy}</p>
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
                <p className="text-sm text-gray-500">待发布</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.scheduled}</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                <Clock size={24} />
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">全部类型</option>
                <option value="notice">通知公告</option>
                <option value="warning">预警提示</option>
                <option value="policy">政策法规</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="scheduled">待发布</option>
                <option value="published">已发布</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              共 <span className="font-semibold text-gray-900">{filteredAnnouncements.length}</span> 条记录
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => {
              const effectiveStatus = getEffectiveStatus(announcement);
              return (
                <div
                  key={announcement.id}
                  className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewDetail(announcement)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${getTypeColor(announcement.type)}`}>
                        {getTypeIcon(announcement.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          <StatusTag status={effectiveStatus} type="announcement" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{announcement.content}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {announcement.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {effectiveStatus === 'published' && announcement.publishTime
                              ? formatDate(announcement.publishTime)
                              : effectiveStatus === 'scheduled' && announcement.scheduledPublishTime
                              ? `计划发布：${formatDate(announcement.scheduledPublishTime)}`
                              : '草稿'}
                          </span>
                          {effectiveStatus === 'scheduled' && announcement.scheduledPublishTime && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Clock size={14} />
                              计划发布时间：{formatDateTime(announcement.scheduledPublishTime)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {announcement.views} 次阅读
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                      {effectiveStatus === 'draft' && (
                        <>
                          <Button size="sm" variant="secondary" onClick={(e) => handleOpenEditModal(announcement, e)}>
                            <Edit size={14} className="mr-1" /> 编辑
                          </Button>
                          <Button size="sm" onClick={() => handlePublishDraft(announcement.id)}>
                            <Send size={14} className="mr-1" /> 发布
                          </Button>
                        </>
                      )}
                      {effectiveStatus === 'scheduled' && (
                        <>
                          <Button size="sm" variant="secondary" onClick={(e) => handleOpenEditModal(announcement, e)}>
                            <Edit size={14} className="mr-1" /> 编辑
                          </Button>
                          <Button size="sm" onClick={() => handlePublishScheduled(announcement.id)}>
                            <Send size={14} className="mr-1" /> 立即发布
                          </Button>
                          <Button size="sm" variant="secondary" onClick={(e) => handleWithdraw(announcement.id, e)}>
                            <RotateCcw size={14} className="mr-1" /> 撤回
                          </Button>
                        </>
                      )}
                      {effectiveStatus === 'published' && (
                        <Button size="sm" variant="secondary" onClick={(e) => handleWithdraw(announcement.id, e)}>
                          <RotateCcw size={14} className="mr-1" /> 撤回
                        </Button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={(e) => handleDelete(announcement.id, e)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无公告记录</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && currentAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getTypeColor(currentAnnouncement.type)}`}>
                  {getTypeIcon(currentAnnouncement.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">公告详情</h2>
                  <p className="text-sm text-gray-500">{getAnnouncementTypeName(currentAnnouncement.type)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentAnnouncement.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {currentAnnouncement.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {getEffectiveStatus(currentAnnouncement) === 'published' && currentAnnouncement.publishTime
                      ? formatDateTime(currentAnnouncement.publishTime)
                      : getEffectiveStatus(currentAnnouncement) === 'scheduled' && currentAnnouncement.scheduledPublishTime
                      ? `计划发布：${formatDateTime(currentAnnouncement.scheduledPublishTime)}`
                      : `创建于 ${formatDateTime(currentAnnouncement.createdAt)}`
                    }
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {currentAnnouncement.views} 次阅读
                  </span>
                  <StatusTag status={getEffectiveStatus(currentAnnouncement)} type="announcement" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="prose max-w-none">
                  {currentAnnouncement.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {getEffectiveStatus(currentAnnouncement) === 'draft' && (
                <>
                  <Button variant="secondary" onClick={() => handleOpenEditModal(currentAnnouncement)}>
                    <Edit size={16} className="mr-2" />
                    编辑
                  </Button>
                  <Button onClick={() => handlePublishDraft(currentAnnouncement.id)}>立即发布</Button>
                </>
              )}
              {getEffectiveStatus(currentAnnouncement) === 'scheduled' && (
                <>
                  <Button variant="secondary" onClick={() => handleOpenEditModal(currentAnnouncement)}>
                    <Edit size={16} className="mr-2" />
                    编辑
                  </Button>
                  <Button onClick={() => handlePublishScheduled(currentAnnouncement.id)}>立即发布</Button>
                  <Button variant="secondary" onClick={() => handleWithdraw(currentAnnouncement.id)}>
                    <RotateCcw size={16} className="mr-2" />
                    撤回
                  </Button>
                </>
              )}
              {getEffectiveStatus(currentAnnouncement) === 'published' && (
                <Button variant="secondary" onClick={() => handleWithdraw(currentAnnouncement.id)}>
                  <RotateCcw size={16} className="mr-2" />
                  撤回
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">编辑公告</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告标题</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="请输入公告标题"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告类型</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm(p => ({ ...p, type: e.target.value as 'notice' | 'warning' | 'policy' }))}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="notice">通知公告</option>
                  <option value="warning">预警提示</option>
                  <option value="policy">政策法规</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告内容</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(p => ({ ...p, content: e.target.value }))}
                  rows={8}
                  placeholder="请输入公告内容..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isScheduled}
                    onChange={(e) => setEditForm(p => ({ ...p, isScheduled: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">定时发布</span>
                </label>
              </div>
              {editForm.isScheduled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
                  <input
                    type="datetime-local"
                    value={editForm.scheduledPublishTime}
                    onChange={(e) => setEditForm(p => ({ ...p, scheduledPublishTime: e.target.value }))}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>取消</Button>
              <Button onClick={handleSaveEdit} disabled={!editForm.title || !editForm.content}>
                <Edit size={16} className="mr-2" />
                保存修改
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">发布公告</h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告标题</label>
                <input
                  type="text"
                  value={publishForm.title}
                  onChange={(e) => setPublishForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="请输入公告标题"
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告类型</label>
                <select
                  value={publishForm.type}
                  onChange={(e) => setPublishForm(p => ({ ...p, type: e.target.value as 'notice' | 'warning' | 'policy' }))}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="notice">通知公告</option>
                  <option value="warning">预警提示</option>
                  <option value="policy">政策法规</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告内容</label>
                <textarea
                  value={publishForm.content}
                  onChange={(e) => setPublishForm(p => ({ ...p, content: e.target.value }))}
                  rows={8}
                  placeholder="请输入公告内容..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishForm.isScheduled}
                    onChange={(e) => setPublishForm(p => ({ ...p, isScheduled: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">定时发布</span>
                </label>
              </div>
              {publishForm.isScheduled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
                  <input
                    type="datetime-local"
                    value={publishForm.scheduledPublishTime}
                    onChange={(e) => setPublishForm(p => ({ ...p, scheduledPublishTime: e.target.value }))}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowPublishModal(false)}>取消</Button>
              <Button onClick={handlePublishNew} disabled={!publishForm.title || !publishForm.content}>
                <Send size={16} className="mr-2" />
                {publishForm.isScheduled ? '设置定时发布' : '立即发布'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
