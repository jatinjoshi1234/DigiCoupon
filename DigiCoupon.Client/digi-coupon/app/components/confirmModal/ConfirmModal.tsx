"use client";

import { AlertTriangle, X } from "lucide-react";

import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  error?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this record?",
  error = "",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  function handleBackdropClick() {
    if (!loading) {
      onCancel();
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <AlertTriangle size={22} />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <h3>{title}</h3>

          <p>{message}</p>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
