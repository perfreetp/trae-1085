import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  Phone,
  User,
  X,
  Upload,
  Image,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { mockObstacles } from '@/data/obstacles';
import type { Obstacle } from '@/types';
import { getObstacleTypeName, formatDate, getRiskLevelName } from '@/utils/helpers';

const Obstacles: React.FC = () => {
  const [obstacles, setObstacles] = useState<Obstacle[]>(mockObstacles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedObstacle, setSelectedObstacle] = useState<Obstacle | null>(null);
  const [newObstacle, setNewObstacle] = useState<Partial<Obstacle>>({
    name: '',
    type: 'tower_crane',
    height: 0,
    address: '',
    ownerUnit: '',
    contactPerson: '',
    contactPhone: '',
    isTemporary: false,
    status: 'normal',
    riskLevel: 'low',
    latitude: 31.2304,
    longitude: 121.4737,
    photos: [],
  });

  const filteredObstacles = obstacles.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleAddObstacle = () => {
    const obstacle: Obstacle = {
      ...newObstacle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photos: [],
    } as Obstacle;
    setObstacles([obstacle, ...obstacles]);
    setShowAddModal(false);
    setNewObstacle({
      name: '',
      type: 'tower_crane',
      height: 0,
      address: '',
      ownerUnit: '',
      contactPerson: '',
      contactPhone: '',
      isTemporary: false,
      status: 'normal',
      riskLevel: 'low',
      latitude: 31.2304,
      longitude: 121.4737,
      photos: [],
    });
  };

  const handleViewDetail = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">障碍物台账</h1>
          <p className="mt-1 text-sm text-gray-500">管理低空障碍物信息，包括塔吊、广告牌、建筑等</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2" />
          登记障碍物
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜索名称、地址..."
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
                <option value="normal">正常</option>
                <option value="warning">预警</option>
                <option value="overheight">超高</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">全部类型</option>
                <option value="tower_crane">塔吊</option>
                <option value="billboard">广告牌</option>
                <option value="building">建筑</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              共 <span className="font-semibold text-gray-900">{filteredObstacles.length}</span> 条记录
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">名称</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">高度</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">地址</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">责任单位</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">风险等级</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">登记时间</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredObstacles.map((obstacle) => (
                  <tr key={obstacle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <Building2 size={20} />
                        </div>
                        <span className="font-medium text-gray-900">{obstacle.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{getObstacleTypeName(obstacle.type)}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{obstacle.height}m</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 max-w-xs truncate">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{obstacle.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{obstacle.ownerUnit}</td>
                    <td className="py-4 px-4"><StatusTag status={obstacle.status} /></td>
                    <td className="py-4 px-4"><StatusTag status={obstacle.riskLevel} type="risk" /></td>
                    <td className="py-4 px-4 text-sm text-gray-500">{formatDate(obstacle.createdAt)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(obstacle)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="编辑">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredObstacles.length === 0 && (
            <div className="py-12 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">暂无匹配的障碍物记录</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">登记障碍物</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">障碍物名称 *</label>
                  <input
                    type="text"
                    value={newObstacle.name}
                    onChange={(e) => setNewObstacle({ ...newObstacle, name: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="请输入障碍物名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类型 *</label>
                  <select
                    value={newObstacle.type}
                    onChange={(e) => setNewObstacle({ ...newObstacle, type: e.target.value as Obstacle['type'] })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="tower_crane">塔吊</option>
                    <option value="billboard">广告牌</option>
                    <option value="building">建筑</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">高度 (米) *</label>
                  <input
                    type="number"
                    value={newObstacle.height}
                    onChange={(e) => setNewObstacle({ ...newObstacle, height: Number(e.target.value) })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="请输入高度"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
                  <select
                    value={newObstacle.riskLevel}
                    onChange={(e) => setNewObstacle({ ...newObstacle, riskLevel: e.target.value as Obstacle['riskLevel'] })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">低风险</option>
                    <option value="medium">中风险</option>
                    <option value="high">高风险</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址 *</label>
                <input
                  type="text"
                  value={newObstacle.address}
                  onChange={(e) => setNewObstacle({ ...newObstacle, address: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="请输入详细地址"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newObstacle.latitude}
                    onChange={(e) => setNewObstacle({ ...newObstacle, latitude: Number(e.target.value) })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newObstacle.longitude}
                    onChange={(e) => setNewObstacle({ ...newObstacle, longitude: Number(e.target.value) })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">责任单位</label>
                  <input
                    type="text"
                    value={newObstacle.ownerUnit}
                    onChange={(e) => setNewObstacle({ ...newObstacle, ownerUnit: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="请输入责任单位"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                  <input
                    type="text"
                    value={newObstacle.contactPerson}
                    onChange={(e) => setNewObstacle({ ...newObstacle, contactPerson: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="请输入联系人姓名"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="tel"
                  value={newObstacle.contactPhone}
                  onChange={(e) => setNewObstacle({ ...newObstacle, contactPhone: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="请输入联系电话"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newObstacle.isTemporary}
                    onChange={(e) => setNewObstacle({ ...newObstacle, isTemporary: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">临时设施</span>
                </label>
                {newObstacle.isTemporary && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">有效期:</label>
                    <input
                      type="date"
                      className="h-9 rounded-lg border border-gray-200 px-2 text-sm"
                      onChange={(e) => setNewObstacle({ ...newObstacle, validFrom: e.target.value })}
                    />
                    <span className="text-gray-400">至</span>
                    <input
                      type="date"
                      className="h-9 rounded-lg border border-gray-200 px-2 text-sm"
                      onChange={(e) => setNewObstacle({ ...newObstacle, validTo: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">照片上传</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">点击或拖拽上传照片</p>
                  <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，单张不超过 5MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>取消</Button>
              <Button onClick={handleAddObstacle}>确认登记</Button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedObstacle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">障碍物详情</h2>
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
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedObstacle.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag status={selectedObstacle.status} />
                    <StatusTag status={selectedObstacle.riskLevel} type="risk" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">类型</p>
                  <p className="font-medium text-gray-900">{getObstacleTypeName(selectedObstacle.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">高度</p>
                  <p className="font-medium text-gray-900">{selectedObstacle.height} 米</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin size={14} /> 地址
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Building2 size={14} /> 责任单位
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.ownerUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <User size={14} /> 联系人
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Phone size={14} /> 联系电话
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.contactPhone}</p>
                </div>
                {selectedObstacle.isTemporary && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar size={14} /> 有效期
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedObstacle.validFrom} 至 {selectedObstacle.validTo}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">登记时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedObstacle.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">更新时间</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedObstacle.updatedAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">位置信息</p>
                <div className="h-48 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      {selectedObstacle.latitude}, {selectedObstacle.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              <Button>编辑信息</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obstacles;
