"use client";

import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminApplication } from "@/redux/features/admin/adminApi";

interface RejectApplicationDialogProps {
  application: AdminApplication | null;
  isRejecting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// Rejecting emails the applicant, so the admin confirms first. Stays open while the request runs.
const RejectApplicationDialog = ({ application, isRejecting, onConfirm, onClose }: RejectApplicationDialogProps) => {
  const t = useTranslations("Admin.applications.rejectDialog");

  return (
    <Dialog
      open={application !== null}
      onOpenChange={(open) => {
        if (!open && !isRejecting) onClose();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", {
              name: application?.applicationPortal.fullName ?? "",
              email: application?.applicationPortal.email ?? "",
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={isRejecting} onClick={onClose} className="cursor-pointer">
            {t("cancel")}
          </Button>
          <Button variant="destructive" disabled={isRejecting} onClick={onConfirm} className="cursor-pointer">
            {isRejecting && <Loader className="size-4 animate-spin" />}
            {isRejecting ? t("rejecting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectApplicationDialog;
