"use client";

import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  /** Open while set; the text says what is about to be deleted. */
  description: string | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// Deleting removes the content from every learner's dashboard, so the admin confirms first.
const ConfirmDeleteDialog = ({ description, isDeleting, onConfirm, onClose }: ConfirmDeleteDialogProps) => {
  const t = useTranslations("Admin.dashboard.deleteDialog");

  return (
    <Dialog
      open={description !== null}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onClose();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="break-words">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={isDeleting} onClick={onClose} className="cursor-pointer">
            {t("cancel")}
          </Button>
          <Button variant="destructive" disabled={isDeleting} onClick={onConfirm} className="cursor-pointer">
            {isDeleting && <Loader className="size-4 animate-spin" />}
            {isDeleting ? t("deleting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
