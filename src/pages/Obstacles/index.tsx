import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
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
  Check,
  Download,
  FileUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusTag } from '@/components/common/StatusTag';
import { useAppStore } from '@/store/useAppStore';
import type { Obstacle } from '@/types';
import { getObstacleTypeName, formatDate, formatDateTime, getRiskLevelName, getStatusName } from '@/utils/helpers';

const Obstacles: React.FC = () => {
  const { obstacles, addObstacle, updateObstacle, deleteObstacle, batchAddObstacles } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [previewData, setPreviewData] = useState<Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedObstacle, setSelectedObstacle] = useState<Obstacle | null>(null);
  const [formData, setFormData] = useState<Partial<Obstacle>>({
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
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

  const filteredObstacles = obstacles.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos],
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index),
    }));
  };

  const handleAddObstacle = () => {
    if (!formData.name || !formData.address) return;
    addObstacle(formData as Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt'>);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditObstacle = () => {
    if (!selectedObstacle || !formData.name || !formData.address) return;
    updateObstacle(selectedObstacle.id, formData);
    setShowEditModal(false);
    resetForm();
    setSelectedObstacle(null);
  };

  const handleDeleteObstacle = (id: string) => {
    if (window.confirm('确定要删除这条障碍物记录吗？')) {
      deleteObstacle(id);
      if (selectedObstacle?.id === id) {
        setShowDetailModal(false);
        setSelectedObstacle(null);
      }
    }
  };

  const handleViewDetail = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setShowDetailModal(true);
  };

  const handleOpenEdit = (obstacle: Obstacle) => {
    setSelectedObstacle(obstacle);
    setFormData({ ...obstacle });
    setShowEditModal(true);
  };

  const handleExport = () => {
    const headers = ['名称', '类型', '高度', '地址', '责任单位', '状态', '风险等级', '登记时间'];
    const rows = filteredObstacles.map((o) => [
      o.name,
      getObstacleTypeName(o.type),
      `${o.height}m`,
      o.address,
      o.ownerUnit || '',
      getStatusName(o.status),
      getRiskLevelName(o.riskLevel),
      formatDate(o.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    link.download = `障碍物台账_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseImportData = (text: string) => {
    const lines = text.trim().split('\n').filter((line) => line.trim());
    const validTypes = ['tower_crane', 'billboard', 'building', 'other'];
    const validRiskLevels = ['low', 'medium', 'high'];
    const parsed: Omit<Obstacle, 'id' | 'createdAt' | 'updatedAt'>[] = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 8) continue;

      const [name, type, height, address, ownerUnit, contactPerson, contactPhone, riskLevel] = parts;
      if (!name || !address) continue;
      if (!validTypes.includes(type)) continue;
      if (!validRiskLevels.includes(riskLevel)) continue;

      const heightNum = Number(height);
      if (isNaN(heightNum)) continue;

      parsed.push({
        name,
        type: type as Obstacle['type'],
        height: heightNum,
        address,
        ownerUnit,
        contactPerson,
        contactPhone,
        riskLevel: riskLevel as Obstacle['riskLevel'],
        isTemporary: false,
        status: 'normal',
        latitude: 31.2304,
        longitude: 121.4737,
        photos: [],
      });
    }

    return parsed;
  };

  const handleImportTextChange = (text: string) => {
    setImportText(text);
    setPreviewData(parseImportData(text));
  };

  const handleBatchImport = () => {
    if (previewData.length === 0) return;
    batchAddObstacles(previewData);
    setShowImportModal(false);
    setImportText('');
    setPreviewData([]);
    setSuccessMessage(`成功导入 ${previewData.length} 条障碍物记录`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderPhotoUpload = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">照片上传</label>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {formData.photos?.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={photo} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 cursor-pointer transition-colors"
        >
          <Upload size={24} className="text-gray-400 mb-1" />
          <p className="text-xs text-gray-400">上传照片</p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <p className="text-xs text-gray-400">支持 JPG、PNG 格式，单张不超过 5MB</p>
    </div>
  );

  const renderForm = (isEdit: boolean = false) => (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">障碍物名称 *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="请输入障碍物名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">类型 *</label>
          <select
            value={formData.type || 'tower_crane'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Obstacle['type'] })}
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
            value={formData.height || 0}
            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="请输入高度"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
          <select
            value={formData.riskLevel || 'low'}
            onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as Obstacle['riskLevel'] })}
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
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            value={formData.latitude || 31.2304}
            onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
          <input
            type="number"
            step="0.0001"
            value={formData.longitude || 121.4737}
            onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">责任单位</label>
          <input
            type="text"
            value={formData.ownerUnit || ''}
            onChange={(e) => setFormData({ ...formData, ownerUnit: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="请输入责任单位"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
          <input
            type="text"
            value={formData.contactPerson || ''}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="请输入联系人姓名"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
        <input
          type="tel"
          value={formData.contactPhone || ''}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="请输入联系电话"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isTemporary || false}
            onChange={(e) => setFormData({ ...formData, isTemporary: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">临时设施</span>
        </label>
        {formData.isTemporary && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">有效期:</label>
            <input
              type="date"
              value={formData.validFrom || ''}
              className="h-9 rounded-lg border border-gray-200 px-2 text-sm"
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            />
            <span className="text-gray-400">至</span>
            <input
              type="date"
              value={formData.validTo || ''}
              className="h-9 rounded-lg border border-gray-200 px-2 text-sm"
              onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
            />
          </div>
        )}
      </div>
      {renderPhotoUpload()}
    </div>
  );

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-lg">
          <Check size={18} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">障碍物台账</h1>
          <p className="mt-1 text-sm text-gray-500">管理低空障碍物信息，包括塔吊、广告牌、建筑等</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={18} className="mr-2" />
            导出
          </Button>
          <Button variant="secondary" onClick={() => setShowImportModal(true)}>
            <FileUp size={18} className="mr-2" />
            批量导入
          </Button>
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus size={18} className="mr-2" />
            登记障碍物
          </Button>
        </div>
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
                        <button
                          onClick={() => handleOpenEdit(obstacle)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteObstacle(obstacle.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
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
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {renderForm(false)}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>取消</Button>
              <Button onClick={handleAddObstacle}>确认登记</Button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">编辑障碍物</h2>
              <button
                onClick={() => { setShowEditModal(false); resetForm(); setSelectedObstacle(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {renderForm(true)}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); setSelectedObstacle(null); }}>取消</Button>
              <Button onClick={handleEditObstacle}>保存修改</Button>
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
                onClick={() => { setShowDetailModal(false); setSelectedObstacle(null); }}
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
                  <p className="font-medium text-gray-900">{selectedObstacle.ownerUnit || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <User size={14} /> 联系人
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.contactPerson || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Phone size={14} /> 联系电话
                  </p>
                  <p className="font-medium text-gray-900">{selectedObstacle.contactPhone || '-'}</p>
                </div>
                {selectedObstacle.isTemporary && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar size={14} /> 有效期
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedObstacle.validFrom || '-'} 至 {selectedObstacle.validTo || '-'}
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

              {selectedObstacle.photos && selectedObstacle.photos.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">现场照片</p>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedObstacle.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
              <Button variant="secondary" onClick={() => { setShowDetailModal(false); setSelectedObstacle(null); }}>关闭</Button>
              <Button onClick={() => { setShowDetailModal(false); handleOpenEdit(selectedObstacle); }}>编辑信息</Button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">批量导入障碍物</h2>
              <button
                onClick={() => { setShowImportModal(false); setImportText(''); setPreviewData([]); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">数据格式说明</label>
                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2">
                  <p>每行一条数据，字段用逗号分隔，顺序如下：</p>
                  <p className="font-mono">名称,类型,高度,地址,责任单位,联系人,联系电话,风险等级</p>
                  <p>类型可选值：tower_crane(塔吊), billboard(广告牌), building(建筑), other(其他)</p>
                  <p>风险等级可选值：low(低风险), medium(中风险), high(高风险)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">粘贴数据</label>
                <textarea
                  value={importText}
                  onChange={(e) => handleImportTextChange(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  placeholder="示例：
塔吊1,tower_crane,50,北京市朝阳区建国路88号,城建集团,张三,13800138000,high
广告牌1,billboard,15,北京市海淀区中关村大街,广告公司,李四,13900139000,medium"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    数据预览 <span className="text-gray-500 font-normal">({previewData.length} 条有效数据)</span>
                  </label>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  {previewData.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">名称</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">类型</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">高度</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">地址</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">风险等级</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewData.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 text-gray-900">{item.name}</td>
                            <td className="py-2 px-3 text-gray-600">{getObstacleTypeName(item.type)}</td>
                            <td className="py-2 px-3 text-gray-600">{item.height}m</td>
                            <td className="py-2 px-3 text-gray-600 max-w-xs truncate">{item.address}</td>
                            <td className="py-2 px-3"><StatusTag status={item.riskLevel} type="risk" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      <FileUp size={32} className="mx-auto mb-2" />
                      <p className="text-sm">粘贴数据后将在此处显示预览</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setShowImportModal(false); setImportText(''); setPreviewData([]); }}>取消</Button>
              <Button onClick={handleBatchImport} disabled={previewData.length === 0}>
                确认导入
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Obstacles;
