"use client";

import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({ open, title, message, confirmLabel = "মুছে ফেলুন", pending, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={pending}>
            না, থাক
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} pending={pending}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[15px] text-ink-2">{message}</p>
    </Modal>
  );
}
