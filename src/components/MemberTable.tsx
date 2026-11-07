import React from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  UserCheck,
  UserX,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { Member } from '../types/member';
import { formatDateVN } from '../utils/storage';

interface MemberTableProps {
  members: Member[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetail: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onToggleStatus: (member: Member) => void;
  onOpenAddModal: () => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenAddModal,
}) => {
  const isAllSelected = members.length > 0 && selectedIds.length === members.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < members.length;

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sky-100 p-10 text-center shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
          <UserPlus className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Chưa có thành viên nào
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Thêm thành viên mới hoặc điều chỉnh bộ lọc tìm kiếm.
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors shadow-xs shadow-sky-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm thành viên</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sky-100/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-sky-50/50 border-b border-sky-100 text-xs font-semibold text-slate-600">
              <th className="py-3 px-3.5 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-400 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3.5">Họ và tên</th>
              <th className="py-3 px-3.5">MSSV</th>
              <th className="py-3 px-3.5">Chức vụ</th>
              <th className="py-3 px-3.5">Liên hệ</th>
              <th className="py-3 px-3.5">Ngày tham gia</th>
              <th className="py-3 px-3.5 text-center">Trạng thái</th>
              <th className="py-3 px-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {members.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              const isLeader = member.role === 'Trưởng nhóm';

              return (
                <tr
                  key={member.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-sky-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Select */}
                  <td className="py-3 px-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(member.id)}
                      className="rounded border-slate-300 text-sky-500 focus:ring-sky-400 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Name + Avatar */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg ${member.avatarColor} text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {member.fullName
                          .trim()
                          .split(' ')
                          .slice(-2)
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <button
                        onClick={() => onViewDetail(member)}
                        className="font-semibold text-slate-900 hover:text-sky-600 text-left transition-colors truncate max-w-[170px]"
                        title="Xem chi tiết"
                      >
                        {member.fullName}
                      </button>
                    </div>
                  </td>

                  {/* MSSV */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {member.studentId}
                    </span>
                  </td>

                  {/* Chức vụ only (Trưởng nhóm / Thành viên) */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {isLeader ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>Trưởng nhóm</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-700">
                        Thành viên
                      </span>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3 h-3 text-sky-400" />
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          className="font-mono hover:text-sky-600 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-sky-600 truncate max-w-[160px] inline-block"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Join Date */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-xs text-slate-500 font-mono tabular-nums">
                    {formatDateVN(member.joinDate)}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(member)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        member.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                      }`}
                      title="Bấm để đổi trạng thái"
                    >
                      {member.status === 'active' ? (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span>Hoạt động</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 text-slate-400" />
                          <span>Ngừng</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions: View, Edit, Delete */}
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onViewDetail(member)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(member)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(member)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
