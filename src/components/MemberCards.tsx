import React from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  UserCheck,
  UserX,
  ShieldCheck
} from 'lucide-react';
import { Member } from '../types/member';

interface MemberCardsProps {
  members: Member[];
  onViewDetail: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onToggleStatus: (member: Member) => void;
  onOpenAddModal: () => void;
}

export const MemberCards: React.FC<MemberCardsProps> = ({
  members,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (members.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {members.map((member) => {
        const isLeader = member.role === 'Trưởng nhóm';

        return (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-sky-100/90 p-4 shadow-xs hover:border-sky-200 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg ${member.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {member.fullName
                      .trim()
                      .split(' ')
                      .slice(-2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4
                      onClick={() => onViewDetail(member)}
                      className="font-bold text-slate-900 text-sm hover:text-sky-600 cursor-pointer truncate"
                    >
                      {member.fullName}
                    </h4>
                    <span className="font-mono text-xs font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                      {member.studentId}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <button
                  onClick={() => onToggleStatus(member)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    member.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                  }`}
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
              </div>

              {/* Role only */}
              <div className="bg-sky-50/40 rounded-lg p-2.5 mb-3 border border-sky-100/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Chức vụ:</span>
                {isLeader ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Trưởng nhóm</span>
                  </span>
                ) : (
                  <span className="font-medium text-slate-700">Thành viên</span>
                )}
              </div>

              {/* Quick Contacts */}
              <div className="space-y-1 text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-sky-400 shrink-0" />
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="font-mono hover:text-sky-600"
                  >
                    {member.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-sky-600 truncate"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onViewDetail(member)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2 py-1 rounded transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(member)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(member)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
