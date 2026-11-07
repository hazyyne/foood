export type MemberStatus = 'active' | 'inactive';

export type MemberRole =
  | 'Trưởng nhóm'
  | 'Thành viên';

export interface Member {
  id: string;
  studentId: string;   // Mã số sinh viên (MSSV)
  fullName: string;    // Họ và tên
  dateOfBirth: string; // YYYY-MM-DD
  phone: string;       // Số điện thoại
  email: string;       // Email
  role: MemberRole;    // Chức vụ: Trưởng nhóm | Thành viên
  joinDate: string;    // YYYY-MM-DD
  status: MemberStatus; // 'active' | 'inactive'
  notes?: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFilter {
  searchQuery: string;
  status: 'all' | 'active' | 'inactive';
  role: string;
  sortBy: 'fullName' | 'joinDate' | 'studentId' | 'dateOfBirth';
  sortOrder: 'asc' | 'desc';
}

export interface ClubStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  activeRate: number;
  newThisMonth: number;
  roleCounts: Record<string, number>;
}
