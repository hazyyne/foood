import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit, Save, AlertCircle } from 'lucide-react';
import { Member, MemberRole, MemberStatus } from '../types/member';
import { ROLES, VALID_MSSV_PREFIXES } from '../data/initialMembers';
import { isValidMSSV, generateValidMSSV } from '../utils/storage';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  initialMember?: Member | null;
  existingMembers: Member[];
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
  existingMembers,
}) => {
  const isEditing = Boolean(initialMember);

  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('Thành viên');
  const [joinDate, setJoinDate] = useState('');
  const [status, setStatus] = useState<MemberStatus>('active');
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState('bg-sky-500');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialMember) {
      setStudentId(initialMember.studentId);
      setFullName(initialMember.fullName);
      setDateOfBirth(initialMember.dateOfBirth);
      setPhone(initialMember.phone);
      setEmail(initialMember.email);
      setRole(initialMember.role);
      setJoinDate(initialMember.joinDate);
      setStatus(initialMember.status);
      setNotes(initialMember.notes || '');
      setAvatarColor(initialMember.avatarColor || 'bg-sky-500');
      setErrors({});
    } else {
      const suggested = generateValidMSSV(existingMembers, '12400');
      setStudentId(suggested);
      setFullName('');
      setDateOfBirth('2004-01-01');
      setPhone('');
      setEmail('');
      setRole('Thành viên');
      setJoinDate(new Date().toISOString().slice(0, 10));
      setStatus('active');
      setNotes('');
      setAvatarColor('bg-sky-500');
      setErrors({});
    }
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const handleStudentIdChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 9);
    setStudentId(digitsOnly);
    if (errors.studentId) {
      setErrors((prev) => ({ ...prev, studentId: '' }));
    }
  };

  const handlePrefixClick = (prefix: '12300' | '12400' | '12500') => {
    const suggested = generateValidMSSV(existingMembers, prefix);
    setStudentId(suggested);
    if (errors.studentId) {
      setErrors((prev) => ({ ...prev, studentId: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedMSSV = studentId.trim();

    if (!trimmedMSSV) {
      newErrors.studentId = 'Vui lòng nhập MSSV';
    } else if (trimmedMSSV.length !== 9) {
      newErrors.studentId = `MSSV phải gồm đúng 9 chữ số (hiện có ${trimmedMSSV.length} số)`;
    } else if (!isValidMSSV(trimmedMSSV)) {
      newErrors.studentId = 'MSSV 9 số phải bắt đầu bằng 12400, 12300 hoặc 12500 (VD: 124000123)';
    } else {
      const isDuplicate = existingMembers.some(
        (m) =>
          m.studentId.trim() === trimmedMSSV &&
          (!initialMember || m.id !== initialMember.id)
      );
      if (isDuplicate) {
        newErrors.studentId = 'MSSV này đã tồn tại trong danh sách';
      }
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    }

    if (!joinDate) {
      newErrors.joinDate = 'Vui lòng chọn ngày tham gia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        dateOfBirth,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        role,
        joinDate,
        status,
        notes: notes.trim() || undefined,
        avatarColor,
      },
      initialMember ? initialMember.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-sky-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/70">
          <div className="flex items-center gap-2 text-sky-700">
            {isEditing ? <Edit className="w-5 h-5 text-sky-600" /> : <UserPlus className="w-5 h-5 text-sky-600" />}
            <h3 className="font-bold text-base text-slate-900">
              {isEditing ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[calc(85vh-6rem)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* MSSV only with 9-digit validation & prefix helpers */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  MSSV (9 số: 12300, 12400 hoặc 12500) <span className="text-rose-500">*</span>
                </label>
                {!isEditing && (
                  <div className="flex items-center gap-1.5 text-[11px] text-sky-600">
                    <span className="text-slate-400">Chọn đầu số:</span>
                    {VALID_MSSV_PREFIXES.map((prefix) => (
                      <button
                        key={prefix}
                        type="button"
                        onClick={() => handlePrefixClick(prefix)}
                        className={`px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
                          studentId.startsWith(prefix)
                            ? 'bg-sky-500 text-white shadow-2xs'
                            : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60'
                        }`}
                      >
                        {prefix}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={9}
                  value={studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                  placeholder="VD: 124000123"
                  className={`w-full px-3 py-2 text-sm font-mono tracking-wide bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.studentId
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-sky-400 focus:ring-sky-400/20'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                  {studentId.length}/9 số
                </span>
              </div>

              {errors.studentId ? (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.studentId}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Bắt buộc 9 chữ số bắt đầu bằng 12300, 12400 hoặc 12500.
                </p>
              )}
            </div>

            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="VD: Nguyễn Văn An"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-rose-400 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-400/20'
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Chức vụ only (Trưởng nhóm / Thành viên) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chức vụ <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* SĐT */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="VD: 0912 345 678"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-400/20'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="VD: an.nguyen@sinhvien.edu.vn"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-400/20'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 font-mono"
              />
            </div>

            {/* Ngày tham gia */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày tham gia
              </label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 font-mono"
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trạng thái
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Đang hoạt động
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  status === 'inactive'
                    ? 'bg-slate-100 text-slate-800 border-slate-300 ring-2 ring-slate-500/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Ngừng hoạt động
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-lg transition-colors shadow-xs shadow-sky-500/25"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Lưu thay đổi' : 'Thêm thành viên'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
