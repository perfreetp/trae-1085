import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusTag } from '@/components/common/StatusTag';
import { mockRiskHotspots, riskLevelData, obstacleTypeData } from '@/data/reports';
import { mockObstacles } from '@/data/obstacles';
import { getRiskLevelName } from '@/utils/helpers';

const RiskAssessment: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const highRiskObstacles = mockObstacles.filter(o => o.riskLevel === 'high');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">风险评估</h1>
        <p className="mt-1 text-sm text-gray-500">净空影响分析、风险等级评定和风险热区统计</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">高风险</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {mockObstacles.filter(o => o.riskLevel === 'high').length}
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
                <p className="text-sm text-gray-500">中风险</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {mockObstacles.filter(o => o.riskLevel === 'medium').length}
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
                <p className="text-sm text-gray-500">低风险</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {mockObstacles.filter(o => o.riskLevel === 'low').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <Activity size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">风险热区</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {mockRiskHotspots.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <MapPin size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>风险热区分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 800 400">
                    <defs>
                      <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid2)" />
                  </svg>
                </div>

                <div className="absolute inset-0 p-6">
                  {mockRiskHotspots.map((hotspot) => {
                    const x = 50 + (hotspot.longitude - 121.43) * 1500;
                    const y = 50 + (31.25 - hotspot.latitude) * 4000;
                    const sizes: Record<string, string> = {
                      low: 'w-20 h-20',
                      medium: 'w-28 h-28',
                      high: 'w-36 h-36',
                    };
                    const colors: Record<string, string> = {
                      low: 'from-amber-500/10 to-amber-500/5',
                      medium: 'from-orange-500/20 to-orange-500/10',
                      high: 'from-red-500/30 to-red-500/15',
                    };
                    return (
                      <div
                        key={hotspot.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                          selectedHotspot === hotspot.id ? 'scale-110' : ''
                        } transition-transform`}
                        style={{ left: `${x}px`, top: `${y}px` }}
                        onClick={() => setSelectedHotspot(
                          selectedHotspot === hotspot.id ? null : hotspot.id
                        )}
                      >
                        <div className={`${sizes[hotspot.riskLevel]} bg-gradient-radial rounded-full flex items-center justify-center`}
                          style={{
                            background: `radial-gradient(circle, ${
                              hotspot.riskLevel === 'high' ? 'rgba(239,68,68,0.3)' :
                              hotspot.riskLevel === 'medium' ? 'rgba(245,158,11,0.2)' :
                              'rgba(16,185,129,0.15)'
                            } 0%, transparent 70%)`,
                          }}
                        >
                          <div className={`w-4 h-4 rounded-full ${
                            hotspot.riskLevel === 'high' ? 'bg-red-500' :
                            hotspot.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                          } ring-4 ring-white/30 animate-pulse`} />
                        </div>
                        {selectedHotspot === hotspot.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-slate-700 z-10">
                            <p className="font-medium">{hotspot.name}</p>
                            <p className="text-slate-400">{hotspot.riskCount} 处风险点</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-slate-700">
                  <p className="text-xs font-medium text-white mb-2">图例</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-300">高风险区</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-slate-300">中风险区</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-300">低风险区</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>风险等级分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                    {(() => {
                      let offset = 0;
                      const total = riskLevelData.reduce((sum, d) => sum + d.value, 0);
                      return riskLevelData.map((d, i) => {
                        const percent = (d.value / total) * 100;
                        const circumference = 251.2;
                        const dashArray = (percent / 100) * circumference;
                        const result = (
                          <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={d.color}
                            strokeWidth="12"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                          />
                        );
                        offset += dashArray;
                        return result;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {mockObstacles.length}
                    </span>
                    <span className="text-xs text-gray-500">总数</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {riskLevelData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>高风险障碍物</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highRiskObstacles.map((obstacle) => (
                  <div
                    key={obstacle.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{obstacle.name}</p>
                        <p className="text-xs text-gray-500">{obstacle.height}m · {obstacle.address}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>风险热区列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">区域名称</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">风险点数量</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">风险等级</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">主要类型</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRiskHotspots.map((hotspot) => (
                  <tr key={hotspot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-blue-500" />
                        <span className="font-medium text-gray-900">{hotspot.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-bold text-gray-900">{hotspot.riskCount}</span>
                      <span className="text-sm text-gray-500 ml-1">处</span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusTag status={hotspot.riskLevel} type="risk" />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      塔吊、广告牌、建筑
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
