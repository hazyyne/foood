import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Member } from '../types/member';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  member?: Member | null;
  batchCount?: number;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  member,
  batchCount,
}) => {
  if (!isOpen) return null;

  const isBatch = Boolean(batchCount && batchCount > 1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1.5">
            {isBatch ? `Xóa ${batchCount} thành viên đã chọn?` : 'Xác nhận xóa thành viên?'}
          </h3>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {isBatch ? (
              <>Bạn có chắc chắn muốn xóa {batchCount} thành viên đã chọn?</>
            ) : (
              <>
                Xóa thành viên <strong className="text-slate-800">{member?.fullName}</strong>{' '}
                (MSSV: <span className="font-mono">{member?.studentId}</span>)?
              </>
            )}
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-lg transition-colors shadow-xs shadow-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
