import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/common/StatCard';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, formatDateTime } from '@/utils/helpers';
import {
  ClipboardList,
  Clock,
  AlertCircle,
  CheckSquare,
  FileText,
  User,
  Building2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import type { TodoItem } from '@/types';

type FilterType = 'all' | 'report_pending' | 'notice_receive' | 'notice_recheck' | 'notice_overdue' | 'task_pending';

const Todo = () => {
  const { getTodoList, currentUser } = useAppStore();
  const [filterType, setFilterType] = useState<FilterType>('all');

  const todoList = useMemo(() => getTodoList(), [getTodoList]);

  const statistics = useMemo(() => {
    const reportPending = todoList.filter((t) => t.type === 'report_pending').length;
    const noticeReceive = todoList.filter((t) => t.type === 'notice_receive').length;
    const noticeRecheck = todoList.filter((t) => t.type === 'notice_recheck').length;
    const noticeOverdue = todoList.filter((t) => t.type === 'notice_overdue').length;
    const taskPending = todoList.filter((t) => t.type === 'task_pending').length;
    const total = todoList.length;
    return { reportPending, noticeReceive, noticeRecheck, noticeOverdue, taskPending, total };
  }, [todoList]);

  const filteredList = useMemo(() => {
    if (filterType === 'all') return todoList;
    return todoList.filter((item) => item.type === filterType);
  }, [todoList, filterType]);

  const getTypeColor = (type: string): 'blue' | 'green' | 'amber' | 'red' | 'purple' => {
    switch (type) {
      case 'report_pending': return 'blue';
      case 'notice_receive': return 'amber';
      case 'notice_recheck': return 'purple';
      case 'notice_overdue': return 'red';
      case 'task_pending': return 'green';
      default: return 'blue';
    }
  };

  const getBadgeVariant = (type: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (type) {
      case 'report_pending': return 'info';
      case 'notice_receive': return 'warning';
      case 'notice_recheck': return 'info';
      case 'notice_overdue': return 'danger';
      case 'task_pending': return 'success';
      default: return 'default';
    }
  };

  const handleProcess = (item: TodoItem) => {
    alert(`跳转到${item.sourceModule}模块处理：${item.title}`);
  };

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'report_pending', label: '待审核' },
    { key: 'notice_receive', label: '待接收' },
    { key: 'notice_recheck', label: '待复查' },
    { key: 'notice_overdue', label: '逾期' },
    { key: 'task_pending', label: '待开始' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">协同待办</h1>
          <p className="text-slate-500 mt-1">集中处理各类待办事项，提高工作效率</p>
        </div>
        <div className="text-sm text-slate-500">
          当前用户：<span className="font-medium text-slate-700">{currentUser?.name || '未登录'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="待审核线索"
          value={statistics.reportPending}
          icon={<FileText className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="待接收整改"
          value={statistics.noticeReceive}
          icon={<ClipboardList className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="待复查通知"
          value={statistics.noticeRecheck}
          icon={<CheckSquare className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="逾期整改"
          value={statistics.noticeOverdue}
          icon={<AlertCircle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          title="待开始任务"
          value={statistics.taskPending}
          icon={<Calendar className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="总计待办"
          value={statistics.total}
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={filterType === tab.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType(tab.key as FilterType)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center">
                <CheckSquare className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500">暂无待办事项</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredList.map((item) => (
            <Card
              key={item.id}
              className={item.type === 'notice_overdue' ? 'border-red-300 bg-red-50' : ''}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={getBadgeVariant(item.type)}>
                        {item.typeName}
                      </Badge>
                      <h3 className="text-base font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>来源：{item.sourceModule}</span>
                      </div>
                      {item.responsibleUnit && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>责任单位：{item.responsibleUnit}</span>
                        </div>
                      )}
                      {item.assignee && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>执行人：{item.assignee}</span>
                        </div>
                      )}
                      {item.deadline && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>截止时间：{formatDate(item.deadline)}</span>
                        </div>
                      )}
                      {item.planTime && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>计划时间：{formatDateTime(item.planTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleProcess(item)}
                      className="gap-1.5"
                    >
                      立即处理
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Todo;
