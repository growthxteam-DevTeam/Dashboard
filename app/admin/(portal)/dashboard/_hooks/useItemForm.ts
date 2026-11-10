"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCreateDashboardItemMutation,
  useUpdateDashboardItemMutation,
  type DashboardItem,
  type DashboardItemType,
} from "@/redux/features/admin/adminApi";

import { buildItemSchema } from "../_constants";
import { fromDateTimeLocal, toDateTimeLocal } from "../_lib/datetime";
import type { ItemFormValues } from "../_types";

interface UseItemFormOptions {
  type: DashboardItemType;
  /** The item being edited; null creates a new one. */
  item: DashboardItem | null;
  onSaved: () => void;
}

export const useItemForm = ({ type, item, onSaved }: UseItemFormOptions) => {
  const t = useTranslations("Admin.dashboard.itemForm");
  const [createItem, { isLoading: isCreating }] = useCreateDashboardItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateDashboardItemMutation();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(buildItemSchema(type)),
    defaultValues: {
      program: item?.program ?? "",
      cohort: item?.cohort ?? "",
      text: item?.text ?? "",
      date: toDateTimeLocal(item?.date ?? null),
      points: item?.points === null || item?.points === undefined ? "" : String(item.points),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const body = {
      program: values.program || null,
      cohort: values.cohort || null,
      text: values.text,
      ...(type !== "announcement" && { date: fromDateTimeLocal(values.date) }),
      ...(type === "assignment" && { points: Number(values.points) }),
    };

    try {
      if (item) await updateItem({ id: item.id, body }).unwrap();
      else await createItem({ type, ...body }).unwrap();
      toast.success(t("saved"));
      onSaved();
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("error")));
    }
  });

  return { form, onSubmit, isSaving: isCreating || isUpdating };
};
