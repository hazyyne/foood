import React from 'react';
import { Search, X, LayoutList, LayoutGrid, Filter, UserPlus } from 'lucide-react';
import { MemberFilter } from '../types/member';
import { ROLES } from '../data/initialMembers';

interface FilterBarProps {
  filter: MemberFilter;
  onFilterChange: (newFilter: Partial<MemberFilter>) => void;
  onResetFilter: () => void;
  totalFiltered: number;
  totalMembers: number;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onOpenAddModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  totalFiltered,
  totalMembers,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
}) => {
  const isFiltered =
    Boolean(filter.searchQuery) ||
    filter.status !== 'all' ||
    Boolean(filter.role);

  return (
    <div className="bg-white rounded-xl border border-sky-100 p-3 sm:p-4 mb-4 shadow-xs space-y-3">
      {/* Primary Row: Search + Status Tabs + Add Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm theo họ tên, MSSV, SĐT..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 focus:bg-white transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-sky-50/70 rounded-lg border border-sky-100 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onFilterChange({ status: 'all' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter.status === 'all'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({totalMembers})
          </button>
          <button
            onClick={() => onFilterChange({ status: 'active' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter.status === 'active'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang hoạt động
          </button>
          <button
            onClick={() => onFilterChange({ status: 'inactive' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter.status === 'inactive'
                ? 'bg-white text-slate-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ngừng hoạt động
          </button>
        </div>

        {/* Actions: Add Member & View Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Xem dạng bảng"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Xem dạng thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-lg transition-colors shadow-xs shadow-sky-500/25 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter Row: Role, Sort */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Chức vụ:</span>
          </div>

          <select
            value={filter.role}
            onChange={(e) => onFilterChange({ role: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:border-sky-400"
          >
            <option value="">Tất cả chức vụ</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                MemberFilter['sortBy'],
                MemberFilter['sortOrder']
              ];
              onFilterChange({ sortBy, sortOrder });
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:border-sky-400"
          >
            <option value="fullName-asc">Tên (A-Z)</option>
            <option value="fullName-desc">Tên (Z-A)</option>
            <option value="studentId-asc">MSSV (Tăng dần)</option>
            <option value="joinDate-desc">Ngày tham gia (Mới nhất)</option>
          </select>

          {isFiltered && (
            <button
              onClick={onResetFilter}
              className="inline-flex items-center gap-1 px-2 py-1 text-rose-600 hover:bg-rose-50 rounded font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        <span className="text-slate-400 font-medium font-mono tabular-nums">
          {totalFiltered}/{totalMembers} thành viên
        </span>
      </div>
    </div>
  );
};
