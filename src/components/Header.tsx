import React from 'react';
import { Users, UserPlus, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenImportExportModal: () => void;
  onResetData: () => void;
  totalMembers: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenImportExportModal,
  onResetData,
  totalMembers
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shadow-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Quản Lí Thành Viên Nhóm
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200/60 hidden sm:inline-block">
                Nhóm học tập
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenImportExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50 transition-colors"
              title="Xuất / Nhập file"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Xuất / Nhập</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Khôi phục danh sách mẫu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-lg transition-colors shadow-xs shadow-sky-500/25"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm thành viên</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
