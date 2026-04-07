"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-[16px] p-[28px] w-[420px] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[40px] h-[40px] rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-[18px] font-[700]" style={{ color: "#111827" }}>{title}</h3>
        </div>
        <p className="text-[14px] mb-6" style={{ color: "#4b5563" }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-[10px] text-[14px] font-[600] bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ color: "#374151" }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-[10px] text-[14px] font-[600] text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
