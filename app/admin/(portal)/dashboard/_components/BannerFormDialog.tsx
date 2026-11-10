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
import { Input } from "@/components/ui/input";
import type { DashboardBanner } from "@/redux/features/admin/adminApi";

import { MAX_WEEKS } from "../_constants";
import { useBannerForm } from "../_hooks/useBannerForm";
import AudienceFields from "./AudienceFields";
import FormRow from "./FormRow";

interface BannerFormDialogProps {
  /** The banner being edited; null adds a new one. */
  banner: DashboardBanner | null;
  onClose: () => void;
}

// Mounted only while open, so every open starts from the banner's current values.
const BannerFormDialog = ({ banner, onClose }: BannerFormDialogProps) => {
  const t = useTranslations("Admin.dashboard.bannerForm");
  const { form, onSubmit, isSaving } = useBannerForm({ banner, onSaved: onClose });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSaving) onClose();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto p-5 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-primary">
            {t(banner ? "titleEdit" : "titleCreate")}
          </DialogTitle>
          <DialogDescription>{t("hint")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <AudienceFields
            register={(name) => register(name)}
            errors={{ program: errors.program?.message, cohort: errors.cohort?.message }}
            allowEveryone={false}
          />

          <FormRow label={t("fields.title")} error={errors.title?.message}>
            <Input maxLength={100} aria-invalid={!!errors.title} {...register("title")} />
          </FormRow>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormRow label={t("fields.durationWeeks")} error={errors.durationWeeks?.message}>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_WEEKS}
                aria-invalid={!!errors.durationWeeks}
                {...register("durationWeeks")}
              />
            </FormRow>
            <FormRow label={t("fields.cohortMembers")} error={errors.cohortMembers?.message}>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                aria-invalid={!!errors.cohortMembers}
                {...register("cohortMembers")}
              />
            </FormRow>
          </div>

          <FormRow label={t("fields.leader")} error={errors.leader?.message}>
            <Input maxLength={100} aria-invalid={!!errors.leader} {...register("leader")} />
          </FormRow>

          <DialogFooter className="-mx-5 -mb-5 mt-1 px-5">
            <Button type="button" variant="outline" disabled={isSaving} onClick={onClose} className="cursor-pointer">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSaving} className="cursor-pointer">
              {isSaving && <Loader className="size-4 animate-spin" />}
              {isSaving ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerFormDialog;
