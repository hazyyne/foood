import { Member } from '../types/member';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    studentId: '123000015',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '2003-05-14',
    phone: '0912 345 678',
    email: 'an.nguyenvan@sinhvien.edu.vn',
    role: 'Trưởng nhóm',
    joinDate: '2023-09-15',
    status: 'active',
    notes: 'K23 ngành Khoa học Máy tính. Phụ trách phân công công việc và điều phối nhóm.',
    avatarColor: 'bg-sky-500',
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'mem-002',
    studentId: '123000089',
    fullName: 'Trần Thị Mai',
    dateOfBirth: '2003-08-22',
    phone: '0987 654 321',
    email: 'mai.tranthi@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-09-15',
    status: 'active',
    notes: 'Phụ trách thuyết trình và thiết kế slide báo cáo.',
    avatarColor: 'bg-sky-600',
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z'
  },
  {
    id: 'mem-003',
    studentId: '124000144',
    fullName: 'Lê Hoàng Nam',
    dateOfBirth: '2004-02-10',
    phone: '0903 112 233',
    email: 'nam.lehoang@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-10-01',
    status: 'active',
    notes: 'Phụ trách lập trình hệ thống và cơ sở dữ liệu.',
    avatarColor: 'bg-cyan-500',
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2024-03-01T11:20:00Z'
  },
  {
    id: 'mem-004',
    studentId: '124000302',
    fullName: 'Phạm Quỳnh Anh',
    dateOfBirth: '2004-11-05',
    phone: '0934 567 890',
    email: 'quynhanh.pham@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-10-01',
    status: 'active',
    notes: 'Biên soạn tài liệu và tổng hợp kết quả nghiên cứu.',
    avatarColor: 'bg-blue-500',
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2024-03-12T16:00:00Z'
  },
  {
    id: 'mem-005',
    studentId: '124000410',
    fullName: 'Đỗ Tuấn Minh',
    dateOfBirth: '2004-07-19',
    phone: '0978 901 234',
    email: 'minh.dotuan@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-10-15',
    status: 'active',
    notes: 'Lên kế hoạch họp nhóm và chuẩn bị cơ sở vật chất.',
    avatarColor: 'bg-sky-500',
    createdAt: '2023-10-15T08:30:00Z',
    updatedAt: '2024-02-28T09:15:00Z'
  },
  {
    id: 'mem-006',
    studentId: '125000108',
    fullName: 'Vũ Hải Đăng',
    dateOfBirth: '2005-03-30',
    phone: '0918 223 344',
    email: 'dang.vu@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2024-03-10',
    status: 'active',
    notes: 'Hỗ trợ kiểm thử phần mềm.',
    avatarColor: 'bg-teal-500',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'mem-007',
    studentId: '125000250',
    fullName: 'Ngô Bảo Ngọc',
    dateOfBirth: '2005-09-12',
    phone: '0966 778 899',
    email: 'ngoc.ngobao@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2024-03-15',
    status: 'active',
    notes: 'Tổng hợp phản hồi và biên tập nội dung.',
    avatarColor: 'bg-indigo-500',
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z'
  },
  {
    id: 'mem-008',
    studentId: '125000330',
    fullName: 'Hoàng Quốc Việt',
    dateOfBirth: '2005-01-25',
    phone: '0945 123 789',
    email: 'viet.hoangquoc@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2024-03-20',
    status: 'active',
    notes: 'Quản lý thu chi và tài liệu nhóm.',
    avatarColor: 'bg-cyan-600',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z'
  },
  {
    id: 'mem-009',
    studentId: '124000512',
    fullName: 'Đặng Thảo Linh',
    dateOfBirth: '2004-12-08',
    phone: '0922 456 789',
    email: 'linh.dangthao@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-11-05',
    status: 'inactive',
    notes: 'Tạm ngừng sinh hoạt nhóm trong kỳ thực tập.',
    avatarColor: 'bg-slate-400',
    createdAt: '2023-11-05T14:00:00Z',
    updatedAt: '2024-04-01T15:00:00Z'
  },
  {
    id: 'mem-010',
    studentId: '123000420',
    fullName: 'Bùi Đức Trọng',
    dateOfBirth: '2003-04-18',
    phone: '0909 887 766',
    email: 'trong.buiduc@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2023-09-20',
    status: 'inactive',
    notes: 'Đã hoàn thành đề tài tốt nghiệp.',
    avatarColor: 'bg-slate-400',
    createdAt: '2023-09-20T09:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z'
  },
  {
    id: 'mem-011',
    studentId: '125000615',
    fullName: 'Lê Thu Trang',
    dateOfBirth: '2005-06-21',
    phone: '0938 119 228',
    email: 'trang.lethu@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2024-04-01',
    status: 'active',
    notes: 'Liên hệ tài liệu tham khảo và khảo sát.',
    avatarColor: 'bg-sky-500',
    createdAt: '2024-04-01T08:30:00Z',
    updatedAt: '2024-04-01T08:30:00Z'
  },
  {
    id: 'mem-012',
    studentId: '125000780',
    fullName: 'Dương Gia Huy',
    dateOfBirth: '2005-10-03',
    phone: '0971 334 556',
    email: 'huy.duonggia@sinhvien.edu.vn',
    role: 'Thành viên',
    joinDate: '2024-04-15',
    status: 'active',
    notes: 'Hỗ trợ thiết kế đồ họa.',
    avatarColor: 'bg-cyan-500',
    createdAt: '2024-04-15T09:00:00Z',
    updatedAt: '2024-04-15T09:00:00Z'
  }
];

export const VALID_MSSV_PREFIXES = ['12300', '12400', '12500'] as const;

export const ROLES = [
  'Trưởng nhóm',
  'Thành viên'
] as const;

export const AVATAR_COLORS = [
  'bg-sky-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-indigo-500'
];
