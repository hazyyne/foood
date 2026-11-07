import React from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { ClubStats } from '../types/member';

interface StatsCardsProps {
  stats: ClubStats;
  currentStatusFilter: 'all' | 'active' | 'inactive';
  onSelectStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  currentStatusFilter,
  onSelectStatusFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
      {/* Total */}
      <button
        onClick={() => onSelectStatusFilter('all')}
        className={`p-4 bg-white rounded-xl border text-left transition-all ${
          currentStatusFilter === 'all'
            ? 'border-sky-400 ring-2 ring-sky-400/20 shadow-xs'
            : 'border-slate-200/80 hover:border-sky-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Tổng thành viên</span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.total}
          </span>
          <span className="text-xs text-slate-400">sinh viên</span>
        </div>
      </button>

      {/* Active */}
      <button
        onClick={() => onSelectStatusFilter('active')}
        className={`p-4 bg-white rounded-xl border text-left transition-all ${
          currentStatusFilter === 'active'
            ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
            : 'border-slate-200/80 hover:border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-600">Đang hoạt động</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {stats.activeCount}
          </span>
          <span className="text-xs text-emerald-600 font-medium font-mono">
            ({stats.activeRate}%)
          </span>
        </div>
      </button>

      {/* Inactive */}
      <button
        onClick={() => onSelectStatusFilter('inactive')}
        className={`p-4 bg-white rounded-xl border text-left transition-all ${
          currentStatusFilter === 'inactive'
            ? 'border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Ngừng hoạt động</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-600 font-mono tabular-nums">
            {stats.inactiveCount}
          </span>
          <span className="text-xs text-slate-400">thành viên</span>
        </div>
      </button>
    </div>
  );
};
