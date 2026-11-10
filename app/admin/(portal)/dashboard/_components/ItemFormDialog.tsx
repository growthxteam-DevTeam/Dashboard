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
import { Textarea } from "@/components/ui/textarea";
import type { DashboardItem, DashboardItemType } from "@/redux/features/admin/adminApi";

import { ITEM_TEXT_MAX_LENGTH, MAX_POINTS } from "../_constants";
import { useItemForm } from "../_hooks/useItemForm";
import AudienceFields from "./AudienceFields";
import FormRow from "./FormRow";

interface ItemFormDialogProps {
  type: DashboardItemType;
  /** The item being edited; null adds a new one. */
  item: DashboardItem | null;
  onClose: () => void;
}

// Mounted only while open (the section renders it conditionally), so every open starts from the
// item's current values.
const ItemFormDialog = ({ type, item, onClose }: ItemFormDialogProps) => {
  const t = useTranslations("Admin.dashboard.itemForm");
  const { form, onSubmit, isSaving } = useItemForm({ type, item, onSaved: onClose });
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
            {t(`titles.${type}.${item ? "edit" : "create"}`)}
          </DialogTitle>
          <DialogDescription>{t("audienceHint")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormRow label={t(`fields.text.${type}`)} error={errors.text?.message}>
            <Textarea
              rows={type === "announcement" ? 4 : 2}
              maxLength={ITEM_TEXT_MAX_LENGTH}
              aria-invalid={!!errors.text}
              {...register("text")}
            />
          </FormRow>

          {type !== "announcement" && (
            <FormRow label={t(`fields.date.${type}`)} error={errors.date?.message}>
              <Input type="datetime-local" aria-invalid={!!errors.date} {...register("date")} />
            </FormRow>
          )}

          {type === "assignment" && (
            <FormRow label={t("fields.points")} error={errors.points?.message}>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_POINTS}
                aria-invalid={!!errors.points}
                {...register("points")}
              />
            </FormRow>
          )}

          <AudienceFields
            register={(name) => register(name)}
            errors={{ program: errors.program?.message, cohort: errors.cohort?.message }}
            allowEveryone
          />

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

export default ItemFormDialog;
