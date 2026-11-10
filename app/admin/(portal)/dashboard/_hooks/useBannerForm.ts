"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { useUpsertDashboardBannerMutation, type DashboardBanner } from "@/redux/features/admin/adminApi";

import { bannerSchema } from "../_constants";
import type { BannerFormValues } from "../_types";

interface UseBannerFormOptions {
  /** The banner being edited; null creates a new one. */
  banner: DashboardBanner | null;
  onSaved: () => void;
}

export const useBannerForm = ({ banner, onSaved }: UseBannerFormOptions) => {
  const t = useTranslations("Admin.dashboard.bannerForm");
  const [upsertBanner, { isLoading }] = useUpsertDashboardBannerMutation();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      program: banner?.program ?? "",
      cohort: banner?.cohort ?? "",
      title: banner?.title ?? "",
      durationWeeks: banner ? String(banner.durationWeeks) : "",
      leader: banner?.leader ?? "",
      cohortMembers: banner ? String(banner.cohortMembers) : "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await upsertBanner({
        program: values.program,
        cohort: values.cohort,
        title: values.title,
        durationWeeks: Number(values.durationWeeks),
        leader: values.leader,
        cohortMembers: Number(values.cohortMembers),
      }).unwrap();
      toast.success(t("saved"));
      onSaved();
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("error")));
    }
  });

  return { form, onSubmit, isSaving: isLoading };
};
