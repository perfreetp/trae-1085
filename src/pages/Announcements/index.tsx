import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { mockAnnouncements } from '@/data/announcements';
import type { Announcement } from '@/types';
import { getAnnouncementTypeName, formatDate, formatDateTime } from '@/utils/helpers';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleViewDetail = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
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
        <Button>
          <Plus size={18} className="mr-2" />
          发布公告
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">通知公告</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {announcements.filter(a => a.type === 'notice').length}
                </p>
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
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {announcements.filter(a => a.type === 'warning').length}
                </p>
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
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {announcements.filter(a => a.type === 'policy').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <FileText size={24} />
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
            </div>
            <div className="text-sm text-gray-500">
              共 <span className="font-semibold text-gray-900">{filteredAnnouncements.length}</span> 条记录
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
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
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <StatusTag status={announcement.status} type="announcement" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{announcement.content}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {announcement.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {announcement.publishTime ? formatDate(announcement.publishTime) : '未发布'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {announcement.views} 次阅读
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {announcement.status === 'draft' && (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <Send size={14} className="mr-1" /> 发布
                      </Button>
                    )}
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getTypeColor(selectedAnnouncement.type)}`}>
                  {getTypeIcon(selectedAnnouncement.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">公告详情</h2>
                  <p className="text-sm text-gray-500">{getAnnouncementTypeName(selectedAnnouncement.type)}</p>
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
                <h3 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {selectedAnnouncement.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {selectedAnnouncement.publishTime
                      ? formatDateTime(selectedAnnouncement.publishTime)
                      : `创建于 ${formatDateTime(selectedAnnouncement.createdAt)}`
                    }
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {selectedAnnouncement.views} 次阅读
                  </span>
                  <StatusTag status={selectedAnnouncement.status} type="announcement" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="prose max-w-none">
                  {selectedAnnouncement.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {selectedAnnouncement.status === 'draft' && (
                <Button>立即发布</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
