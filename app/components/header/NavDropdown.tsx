"use client";

import { useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

interface NavDropdownProps {
  /** メニュー項目（NavLink など。Server Component で描画済み） */
  children: ReactNode;
  /** 開いたときに出すパネル（Server Component で描画済み） */
  panel: ReactNode;
}

/**
 * ホバー・キーボード操作で開くサブメニュー付きのナビ項目。
 * ヘッダーはページを移動しても作り直されないので、CSS の :hover / :focus-within だけだと
 * クリックしたリンクにフォーカスが残って開きっぱなしになる。開閉はここで持ち、リンクを選んだら閉じる。
 *
 * 見た目は子孫側で `group-data-[open=true]/menu:` を使って指定する。
 */
export default function NavDropdown({ children, panel }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  /** Esc で閉じてフォーカスを項目に戻すとき、その focus で開き直さないための印 */
  const skipNextFocusOpen = useRef(false);

  // マウスのクリックでもフォーカスは移るので、キーボード操作（:focus-visible）のときだけ開く
  const openOnKeyboardFocus = (e: FocusEvent<HTMLLIElement>) => {
    if (skipNextFocusOpen.current) {
      skipNextFocusOpen.current = false;
      return;
    }
    if (e.target.matches(":focus-visible")) setIsOpen(true);
  };

  const closeWhenFocusLeaves = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false);
  };

  const closeOnLinkClick = (e: MouseEvent<HTMLLIElement>) => {
    if ((e.target as HTMLElement).closest("a")) setIsOpen(false);
  };

  // Esc で閉じたら、隠れるサブメニュー内にフォーカスを残さず項目（Space）へ戻す
  const closeOnEscape = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key !== "Escape" || !isOpen) return;
    setIsOpen(false);
    const trigger = e.currentTarget.querySelector("a");
    if (trigger && trigger !== document.activeElement) {
      skipNextFocusOpen.current = true;
      trigger.focus();
    }
  };

  return (
    <li
      className="group/menu relative"
      data-open={isOpen || undefined}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={openOnKeyboardFocus}
      onBlur={closeWhenFocusLeaves}
      onClick={closeOnLinkClick}
      onKeyDown={closeOnEscape}
    >
      {children}
      {panel}
    </li>
  );
}
