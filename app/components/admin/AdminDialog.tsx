"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface AdminDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** 管理画面のモーダル（ネイティブの dialog。Esc・背景以外の閉じるボタンで閉じる） */
export default function AdminDialog({ title, onClose, children }: AdminDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // 閉じるのは親が描画をやめたとき（要素ごと消える）。cleanup で close() すると close イベントが
  // onClose を呼び、開発時の effect の二重実行で開いた直後に閉じてしまうので呼ばない
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="admin-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[90vh] p-0 bg-white text-[#2C2C2C] border border-[#E5E4DF] backdrop:bg-[#2C2C2C]/40"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-[#E5E4DF]">
        <h2 id="admin-dialog-title" className="text-base font-medium">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="p-1 text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}
