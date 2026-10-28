import { useEffect, useRef, type RefObject } from "react";

const dialogs: HTMLElement[] = [];
const inertOwners = new Map<HTMLElement, { count: number; original: boolean }>();
let scrollOwners = 0;
let originalOverflow = "";

/** Keep modal focus, background interaction and scroll locking in one place. */
export function useDialog(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    const background: HTMLElement[] = [];
    let branch: HTMLElement = dialog;
    while (branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling === branch || !(sibling instanceof HTMLElement) || sibling.tagName === "SCRIPT") continue;
        const owner = inertOwners.get(sibling) || { count: 0, original: sibling.hasAttribute("inert") };
        owner.count += 1;
        inertOwners.set(sibling, owner);
        sibling.setAttribute("inert", "");
        background.push(sibling);
      }
      if (branch.parentElement === document.body) break;
      branch = branch.parentElement;
    }
    if (scrollOwners++ === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialogs.push(dialog);
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    )).filter((element) => !element.closest('[inert], [hidden], [aria-hidden="true"]') &&
      getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden");
    const focusFirst = () => (focusable()[0] || dialog).focus();
    focusFirst();
    const isTop = () => dialogs[dialogs.length - 1] === dialog;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTop()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (isTop() && event.target instanceof window.Node && !dialog.contains(event.target)) focusFirst();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocus);
      dialogs.splice(dialogs.indexOf(dialog), 1);
      for (const element of background) {
        const owner = inertOwners.get(element)!;
        if (--owner.count === 0) { if (!owner.original) element.removeAttribute("inert"); inertOwners.delete(element); }
      }
      if (--scrollOwners === 0) document.body.style.overflow = originalOverflow;
      if (opener?.isConnected && !opener.closest("[inert]")) opener.focus();
    };
  }, [open, ref]);
}
