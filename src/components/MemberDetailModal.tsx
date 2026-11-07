import React, { useState } from 'react';
import {
  X,
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserX,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Member } from '../types/member';
import { formatDateVN } from '../utils/storage';

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onToggleStatus: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !member) return null;

  const handleCopy = () => {
    const text = `THẺ THÀNH VIÊN
Họ tên: ${member.fullName}
MSSV: ${member.studentId}
Chức vụ: ${member.role}
SĐT: ${member.phone}
Email: ${member.email}
Ngày sinh: ${formatDateVN(member.dateOfBirth)}
Ngày tham gia: ${formatDateVN(member.joinDate)}
Trạng thái: ${member.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLeader = member.role === 'Trưởng nhóm';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-sky-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-sky-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wide uppercase">
              Thẻ thành viên nhóm
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Card Preview */}
          <div className="rounded-xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-600 text-white p-5 shadow-sm">
            <div className="flex justify-between items-start pb-3 border-b border-white/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-100">
                Thành viên nhóm
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/20">
                MSSV: {member.studentId}
              </span>
            </div>

            <div className="py-4 flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-xl ${member.avatarColor} text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white/40`}
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
                <h3 className="font-bold text-lg leading-tight truncate">{member.fullName}</h3>
                <div className="mt-1">
                  {isLeader ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-white/25 text-white">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Trưởng nhóm</span>
                    </span>
                  ) : (
                    <span className="text-xs text-sky-100 font-medium">Thành viên</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/20 flex justify-between text-xs text-sky-100 font-mono">
              <span>Sinh: {formatDateVN(member.dateOfBirth)}</span>
              <span>Tham gia: {formatDateVN(member.joinDate)}</span>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-500" />
                Chức vụ:
              </span>
              <span className="font-semibold text-slate-800">{member.role}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-500" />
                SĐT:
              </span>
              <a
                href={`tel:${member.phone.replace(/\s+/g, '')}`}
                className="font-mono font-semibold text-sky-600 hover:underline"
              >
                {member.phone}
              </a>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                Email:
              </span>
              <a
                href={`mailto:${member.email}`}
                className="font-medium text-sky-600 hover:underline truncate max-w-[200px]"
              >
                {member.email}
              </a>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                Trạng thái:
              </span>
              <button
                onClick={() => onToggleStatus(member)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  member.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {member.status === 'active' ? (
                  <>
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>Đang hoạt động</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3 text-slate-600" />
                    <span>Ngừng hoạt động</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors shadow-xs shadow-sky-500/20"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
