"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import {
  useDeleteDashboardItemMutation,
  useGetDashboardItemsQuery,
  type DashboardItemType,
} from "@/redux/features/admin/adminApi";

export const useDashboardItems = (type: DashboardItemType) => {
  const t = useTranslations("Admin.dashboard.deleteDialog");
  const { data, isLoading, isError, refetch } = useGetDashboardItemsQuery(type);
  const [deleteItem, { isLoading: isDeleting }] = useDeleteDashboardItemMutation();

  // Resolves true once deleted, so the confirmation dialog knows whether to close.
  const removeItem = async (id: string) => {
    try {
      await deleteItem(id).unwrap();
      toast.success(t("deleted"));
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("error")));
      return false;
    }
  };

  return { items: data?.data ?? [], isLoading, isError, refetch, removeItem, isDeleting };
};
