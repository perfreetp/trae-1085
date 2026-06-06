import React, { useState } from 'react';
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
import { mockRectificationNotices } from '@/data/tasks';
import { mockObstacles } from '@/data/obstacles';
import type { RectificationNotice } from '@/types';
import { formatDate, formatDateTime } from '@/utils/helpers';

const Inspection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warnings' | 'rectifications'>('warnings');
  const [notices, setNotices] = useState<RectificationNotice[]>(mockRectificationNotices);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<RectificationNotice | null>(null);

  const overheightObstacles = mockObstacles.filter(o => o.status === 'overheight' || o.status === 'warning');

  const handleViewDetail = (notice: RectificationNotice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">核查处置</h1>
          <p className="mt-1 text-sm text-gray-500">超高预警、整改通知和复查销号管理</p>
        </div>
        <Button>
          <Send size={18} className="mr-2" />
          下发整改通知
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">超高预警</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {overheightObstacles.filter(o => o.status === 'overheight').length}
                </p>
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
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {overheightObstacles.filter(o => o.status === 'warning').length}
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
                <p className="text-sm text-gray-500">整改中</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {notices.filter(n => n.status === 'rectifying' || n.status === 'issued').length}
                </p>
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
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {notices.filter(n => n.status === 'completed').length}
                </p>
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
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{obstacle.name}</h3>
                          <StatusTag status={obstacle.status} />
                          <StatusTag status={obstacle.riskLevel} type="risk" />
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">类型：</span>
                            <span className="font-medium text-gray-900">{obstacle.type === 'tower_crane' ? '塔吊' : obstacle.type === 'billboard' ? '广告牌' : '建筑'}</span>
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
                      <Button size="sm">
                        <Send size={14} className="mr-1" /> 下发整改
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rectifications' && (
            <div className="space-y-4">
              {notices.map((notice) => (
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
                        <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-2 ml-4">
                      {notice.status === 'issued' && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>
                          确认接收
                        </Button>
                      )}
                      {notice.status === 'rectifying' && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>
                          申请复查
                        </Button>
                      )}
                      {notice.status === 'rechecking' && (
                        <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); }}>
                          <Check size={14} className="mr-1" /> 通过销号
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showDetailModal && selectedNotice && (
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
                  <h3 className="text-lg font-semibold text-gray-900">{selectedNotice.title}</h3>
                  <StatusTag status={selectedNotice.status} type="rectification" />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">整改内容</p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700">{selectedNotice.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">关联障碍物</p>
                  <p className="font-medium text-gray-900">{selectedNotice.obstacleName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">责任单位</p>
                  <p className="font-medium text-gray-900">{selectedNotice.responsibleUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">联系人</p>
                  <p className="font-medium text-gray-900">{selectedNotice.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">联系电话</p>
                  <p className="font-medium text-gray-900">{selectedNotice.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">下发时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedNotice.issueTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">整改截止</p>
                  <p className={`font-medium ${selectedNotice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(selectedNotice.deadline)}
                  </p>
                </div>
              </div>

              {selectedNotice.recheckResult && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">复查结果</p>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700">{selectedNotice.recheckResult}</p>
                    <p className="text-sm text-emerald-600 mt-2">
                      复查时间：{selectedNotice.recheckTime && formatDateTime(selectedNotice.recheckTime)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              {selectedNotice.status === 'rechecking' && (
                <>
                  <Button variant="danger">退回整改</Button>
                  <Button variant="success">通过销号</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspection;
