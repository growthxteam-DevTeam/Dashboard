"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { useDeleteDashboardBannerMutation, useGetDashboardBannersQuery } from "@/redux/features/admin/adminApi";

export const useBanners = () => {
  const t = useTranslations("Admin.dashboard.deleteDialog");
  const { data, isLoading, isError, refetch } = useGetDashboardBannersQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteDashboardBannerMutation();

  // Resolves true once deleted, so the confirmation dialog knows whether to close.
  const removeBanner = async (id: string) => {
    try {
      await deleteBanner(id).unwrap();
      toast.success(t("deleted"));
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("error")));
      return false;
    }
  };

  return { banners: data?.data ?? [], isLoading, isError, refetch, removeBanner, isDeleting };
};
