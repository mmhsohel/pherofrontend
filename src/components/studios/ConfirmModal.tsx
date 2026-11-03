"use client";
export default function ConfirmModal({ open, title, text, confirmText = "Confirm", onConfirm, onClose, busy }:
  { open: boolean; title: string; text: string; confirmText?: string; onConfirm: () => void; onClose: () => void; busy?: boolean }) {
  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/70">{text}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Keep it</button>
          <button className="btn btn-error" onClick={onConfirm} disabled={busy}>
            {busy ? <span className="loading loading-spinner" /> : confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}