import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={cn(
                'mt-2 flex items-center text-sm',
                trend.isUp ? 'text-emerald-600' : 'text-red-600'
              )}>
                <span>{trend.isUp ? '↑' : '↓'}</span>
                <span className="ml-1">{Math.abs(trend.value)}% 较上月</span>
              </p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-xl bg-gradient-to-br text-white',
            colorClasses[color]
          )}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
