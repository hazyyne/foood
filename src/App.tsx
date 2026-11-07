/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  XCircle,
  FileDown
} from 'lucide-react';
import { Member, MemberFilter, MemberStatus } from './types/member';
import {
  loadMembers,
  saveMembers,
  resetMembersToDefault,
  calculateStats,
  exportToCSV
} from './utils/storage';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { MemberTable } from './components/MemberTable';
import { MemberCards } from './components/MemberCards';
import { MemberModal } from './components/MemberModal';
import { MemberDetailModal } from './components/MemberDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ImportExportModal } from './components/ImportExportModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [filter, setFilter] = useState<MemberFilter>({
    searchQuery: '',
    status: 'all',
    role: '',
    sortBy: 'fullName',
    sortOrder: 'asc',
  });

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    member?: Member | null;
    isBatch?: boolean;
  } | null>(null);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const stats = useMemo(() => calculateStats(members), [members]);

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        if (filter.status !== 'all' && member.status !== filter.status) {
          return false;
        }
        if (filter.role && member.role !== filter.role) {
          return false;
        }
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.trim().toLowerCase();
          const matchName = member.fullName.toLowerCase().includes(q);
          const matchStudentId = member.studentId.toLowerCase().includes(q);
          const matchEmail = member.email.toLowerCase().includes(q);
          const matchPhone = member.phone.toLowerCase().includes(q);

          if (!matchName && !matchStudentId && !matchEmail && !matchPhone) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const orderFactor = filter.sortOrder === 'asc' ? 1 : -1;
        if (filter.sortBy === 'fullName') {
          return a.fullName.localeCompare(b.fullName, 'vi') * orderFactor;
        }
        if (filter.sortBy === 'joinDate') {
          return (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) * orderFactor;
        }
        if (filter.sortBy === 'studentId') {
          return a.studentId.localeCompare(b.studentId) * orderFactor;
        }
        if (filter.sortBy === 'dateOfBirth') {
          return (new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()) * orderFactor;
        }
        return 0;
      });
  }, [members, filter]);

  const handleSaveMember = (
    memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    const now = new Date().toISOString();

    if (editId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editId
            ? {
                ...m,
                ...memberData,
                updatedAt: now,
              }
            : m
        )
      );
      addToast(
        'success',
        'Đã cập nhật',
        `Thông tin thành viên ${memberData.fullName} đã được lưu.`
      );
    } else {
      const newMember: Member = {
        id: 'mem-' + Date.now(),
        ...memberData,
        createdAt: now,
        updatedAt: now,
      };
      setMembers((prev) => [newMember, ...prev]);
      addToast(
        'success',
        'Đã thêm thành viên',
        `Thành viên ${memberData.fullName} (MSSV: ${memberData.studentId}) đã được thêm.`
      );
    }

    setIsAddEditModalOpen(false);
    setEditingMember(null);
  };

  const handleToggleStatus = (member: Member) => {
    const nextStatus: MemberStatus = member.status === 'active' ? 'inactive' : 'active';
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    if (detailMember && detailMember.id === member.id) {
      setDetailMember((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.isBatch) {
      const count = selectedIds.length;
      setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      addToast('success', 'Đã xóa', `Đã xóa ${count} thành viên đã chọn.`);
    } else if (deleteTarget.member) {
      const targetName = deleteTarget.member.fullName;
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.member!.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.member!.id));
      addToast('success', 'Đã xóa', `Thành viên ${targetName} đã được gỡ.`);
    }

    setDeleteTarget(null);
  };

  const handleBatchStatus = (newStatus: MemberStatus) => {
    if (selectedIds.length === 0) return;
    setMembers((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id)
          ? {
              ...m,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    addToast(
      'success',
      'Đã cập nhật',
      `Đã chuyển ${selectedIds.length} thành viên sang trạng thái "${
        newStatus === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'
      }".`
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map((m) => m.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetToDefault = () => {
    const reset = resetMembersToDefault();
    setMembers(reset);
    setSelectedIds([]);
    addToast('info', 'Đã khôi phục', 'Dữ liệu mẫu đã được tải lại.');
  };

  const handleImportMembers = (importedList: Member[]) => {
    setMembers(importedList);
    setSelectedIds([]);
    addToast('success', 'Đã nhập dữ liệu', `Đã tải lên ${importedList.length} thành viên.`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <Header
        onOpenAddModal={() => {
          setEditingMember(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        onResetData={handleResetToDefault}
        totalMembers={members.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Compact stats overview */}
        <StatsCards
          stats={stats}
          currentStatusFilter={filter.status}
          onSelectStatusFilter={(status) => setFilter((prev) => ({ ...prev, status }))}
        />

        {/* Filter and Actions Bar */}
        <FilterBar
          filter={filter}
          onFilterChange={(newFilter) => setFilter((prev) => ({ ...prev, ...newFilter }))}
          onResetFilter={() =>
            setFilter({
              searchQuery: '',
              status: 'all',
              role: '',
              sortBy: 'fullName',
              sortOrder: 'asc',
            })
          }
          totalFiltered={filteredMembers.length}
          totalMembers={members.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddModal={() => {
            setEditingMember(null);
            setIsAddEditModalOpen(true);
          }}
        />

        {/* Batch action bar when items selected */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-2.5 bg-sky-50 border border-sky-200 rounded-xl flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs">
                {selectedIds.length}
              </span>
              <span>Đã chọn {selectedIds.length} thành viên</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleBatchStatus('active')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hoạt động</span>
              </button>

              <button
                onClick={() => handleBatchStatus('inactive')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Ngừng</span>
              </button>

              <button
                onClick={() => setDeleteTarget({ isBatch: true })}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}

        {/* Member Table or Cards */}
        {viewMode === 'table' ? (
          <MemberTable
            members={filteredMembers}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewDetail={(member) => setDetailMember(member)}
            onEdit={(member) => {
              setEditingMember(member);
              setIsAddEditModalOpen(true);
            }}
            onDelete={(member) => setDeleteTarget({ member })}
            onToggleStatus={handleToggleStatus}
            onOpenAddModal={() => {
              setEditingMember(null);
              setIsAddEditModalOpen(true);
            }}
          />
        ) : (
          <MemberCards
            members={filteredMembers}
            onViewDetail={(member) => setDetailMember(member)}
            onEdit={(member) => {
              setEditingMember(member);
              setIsAddEditModalOpen(true);
            }}
            onDelete={(member) => setDeleteTarget({ member })}
            onToggleStatus={handleToggleStatus}
            onOpenAddModal={() => {
              setEditingMember(null);
              setIsAddEditModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-sky-100/80 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>Quản Lí Thành Viên Nhóm</span>
            <span>·</span>
            <span className="text-slate-400">Hệ thống quản lý nhóm sinh viên</span>
          </div>
          <button
            onClick={() => exportToCSV(members)}
            className="hover:text-sky-600 transition-colors inline-flex items-center gap-1 text-slate-500"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <MemberModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        initialMember={editingMember}
        existingMembers={members}
      />

      <MemberDetailModal
        member={detailMember}
        isOpen={Boolean(detailMember)}
        onClose={() => setDetailMember(null)}
        onEdit={(member) => {
          setEditingMember(member);
          setIsAddEditModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        member={deleteTarget?.member}
        batchCount={deleteTarget?.isBatch ? selectedIds.length : undefined}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        members={members}
        onImport={handleImportMembers}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
