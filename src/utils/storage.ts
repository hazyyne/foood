import { Member, ClubStats } from '../types/member';
import { INITIAL_MEMBERS, VALID_MSSV_PREFIXES } from '../data/initialMembers';

const STORAGE_KEY = 'member_management_data_v5';

export function isValidMSSV(mssv: string): boolean {
  if (!mssv) return false;
  const clean = mssv.trim();
  // Must be 9 digits and start with 12300, 12400, or 12500
  return /^(12300|12400|12500)\d{4}$/.test(clean);
}

export function generateValidMSSV(existingMembers: Member[], prefix: '12300' | '12400' | '12500' = '12400'): string {
  const existingSet = new Set(existingMembers.map((m) => m.studentId));
  for (let i = 1; i <= 9999; i++) {
    const candidate = `${prefix}${String(i).padStart(4, '0')}`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `${prefix}0999`;
}

export function loadMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MEMBERS;
  } catch (err) {
    console.error('Failed to load members from localStorage:', err);
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save members to localStorage:', err);
  }
}

export function resetMembersToDefault(): Member[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  return INITIAL_MEMBERS;
}

export function calculateStats(members: Member[]): ClubStats {
  const total = members.length;
  const activeCount = members.filter((m) => m.status === 'active').length;
  const inactiveCount = total - activeCount;
  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const newThisMonth = members.filter((m) => {
    if (!m.joinDate) return false;
    const d = new Date(m.joinDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  const roleCounts: Record<string, number> = {};

  members.forEach((m) => {
    if (m.role) {
      roleCounts[m.role] = (roleCounts[m.role] || 0) + 1;
    }
  });

  return {
    total,
    activeCount,
    inactiveCount,
    activeRate,
    newThisMonth,
    roleCounts
  };
}

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export function exportToCSV(members: Member[]): void {
  const headers = [
    'MSSV',
    'Họ và tên',
    'Chức vụ',
    'Số điện thoại',
    'Email',
    'Ngày sinh',
    'Ngày tham gia',
    'Trạng thái'
  ];

  const rows = members.map((m) => [
    `"${m.studentId || ''}"`,
    `"${m.fullName.replace(/"/g, '""')}"`,
    `"${m.role || ''}"`,
    `"${m.phone || ''}"`,
    `"${m.email || ''}"`,
    `"${formatDateVN(m.dateOfBirth)}"`,
    `"${formatDateVN(m.joinDate)}"`,
    `"${m.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `danh_sach_thanh_vien_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(members: Member[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(members, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `members_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
