import React, { useState } from 'react';
import {
  Plus,
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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { mockPublicReports } from '@/data/reports';
import type { PublicReport } from '@/types';
import { formatDate, formatDateTime } from '@/utils/helpers';

const PublicReport: React.FC = () => {
  const [reports, setReports] = useState<PublicReport[]>(mockPublicReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (report: PublicReport) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">群众上报</h1>
          <p className="mt-1 text-sm text-gray-500">受理公众上报的线索，进行审核和处理</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          新建上报
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {reports.filter(r => r.status === 'pending').length}
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
                <p className="text-sm text-gray-500">审核中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {reports.filter(r => r.status === 'reviewing').length}
                </p>
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
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {reports.filter(r => r.status === 'processing').length}
                </p>
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
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {reports.filter(r => r.status === 'completed').length}
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
                <p className="text-sm text-gray-500">已合并</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {reports.filter(r => r.status === 'merged').length}
                </p>
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
            {filteredReports.map((report) => (
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
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <StatusTag status={report.status} type="report" />
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
                  <div className="flex items-center gap-2 ml-4">
                    {report.status === 'pending' && (
                      <>
                        <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); }}>
                          <Check size={14} className="mr-1" /> 通过
                        </Button>
                        <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); }}>
                          <X size={14} className="mr-1" /> 驳回
                        </Button>
                      </>
                    )}
                    {report.status === 'pending' && (
                      <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); }}>
                        <Merge size={14} className="mr-1" /> 合并
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showDetailModal && selectedReport && (
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
                  <h3 className="text-lg font-semibold text-gray-900">{selectedReport.title}</h3>
                  <StatusTag status={selectedReport.status} type="report" />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">问题描述</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <User size={14} /> 上报人
                  </p>
                  <p className="font-medium text-gray-900">{selectedReport.reporterName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Phone size={14} /> 联系电话
                  </p>
                  <p className="font-medium text-gray-900">{selectedReport.reporterPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin size={14} /> 位置
                  </p>
                  <p className="font-medium text-gray-900">{selectedReport.location.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReport.location.latitude}, {selectedReport.location.longitude}
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
                  {selectedReport.photos.length > 0 ? (
                    selectedReport.photos.map((photo, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-gray-100" />
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-gray-400 py-8">暂无照片</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>上报时间：{formatDateTime(selectedReport.createdAt)}</span>
                {selectedReport.relatedTaskId && (
                  <span>关联任务：{selectedReport.relatedTaskId}</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {selectedReport.status === 'pending' && (
                <>
                  <Button variant="danger">驳回</Button>
                  <Button>派发任务</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicReport;
