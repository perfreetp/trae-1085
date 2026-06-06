import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { getStatusName, getRiskLevelName } from '@/utils/helpers';

interface StatusTagProps {
  status: string;
  type?: 'obstacle' | 'task' | 'report' | 'rectification' | 'announcement' | 'risk';
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'obstacle' }) => {
  const getVariant = (): 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'default' => {
    if (type === 'risk') {
      switch (status) {
        case 'low': return 'success';
        case 'medium': return 'warning';
        case 'high': return 'danger';
        default: return 'gray';
      }
    }
    
    switch (status) {
      case 'normal':
      case 'completed':
      case 'published':
        return 'success';
      case 'warning':
      case 'pending':
      case 'in_progress':
      case 'reviewing':
      case 'processing':
      case 'issued':
      case 'rectifying':
      case 'rechecking':
      case 'draft':
      case 'scheduled':
        return 'warning';
      case 'overheight':
      case 'rejected':
      case 'overdue':
        return 'danger';
      case 'merged':
      case 'archived':
        return 'gray';
      default:
        return 'default';
    }
  };

  const displayText = type === 'risk' ? getRiskLevelName(status) : getStatusName(status);

  return <Badge variant={getVariant()}>{displayText}</Badge>;
};
