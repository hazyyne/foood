import React, { useRef, useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileCode,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Member } from '../types/member';
import { exportToCSV, exportToJSON } from '../utils/storage';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onImport: (importedMembers: Member[]) => void;
  onResetToDefault: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  members,
  onImport,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportToCSV(members);
    setSuccessMsg('Đã tải xuống file Excel (CSV)!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleExportJSON = () => {
    exportToJSON(members);
    setSuccessMsg('Đã tải xuống file sao lưu JSON!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].fullName && (parsed[0].studentId || parsed[0].memberCode)) {
          // Normalize if any has memberCode -> studentId
          const normalized = parsed.map((item: any, idx: number) => ({
            ...item,
            studentId: item.studentId || item.memberCode || `SV${idx + 1}`
          }));
          onImport(normalized);
          setSuccessMsg(`Đã nhập thành công ${normalized.length} thành viên!`);
          setTimeout(() => onClose(), 1200);
        } else {
          setErrorMsg('File JSON không đúng cấu trúc danh sách thành viên.');
        }
      } catch (err) {
        setErrorMsg('Lỗi định dạng file JSON.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-sky-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/70">
          <h3 className="font-bold text-sm text-slate-900">Xuất & Nhập dữ liệu</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {successMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Export */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Xuất file
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleExportCSV}
                className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 flex flex-col items-center text-center gap-1.5 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">File Excel (CSV)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 flex flex-col items-center text-center gap-1.5 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">File JSON</span>
              </button>
            </div>
          </div>

          {/* Import */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Nhập file
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl border border-dashed border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 flex items-center justify-center gap-2 transition-colors text-slate-700 text-xs font-semibold"
            >
              <Upload className="w-4 h-4 text-sky-500" />
              <span>Tải file JSON từ máy</span>
            </button>
          </div>

          {/* Reset */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Khôi phục danh sách mẫu</span>
            <button
              onClick={() => {
                onResetToDefault();
                setSuccessMsg('Đã khôi phục dữ liệu mẫu!');
                setTimeout(() => setSuccessMsg(''), 2500);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
