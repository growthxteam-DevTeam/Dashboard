"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import {
  ADMIN_APPLICATIONS_PAGE_SIZE,
  useGetAdminApplicationsQuery,
  useInviteApplicantMutation,
  useRejectApplicantMutation,
} from "@/redux/features/admin/adminApi";

export const useAdminApplications = () => {
  const t = useTranslations("Admin.applications");
  const [page, setPage] = useState(1);
  // `data` keeps the previous page while the next one loads, so the table doesn't flash empty.
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminApplicationsQuery({
    page,
    limit: ADMIN_APPLICATIONS_PAGE_SIZE,
  });
  const totalPages = data?.meta.totalPages ?? 1;

  const [inviteApplicant] = useInviteApplicantMutation();
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [rejectApplicant] = useRejectApplicantMutation();
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const sendInvite = async (id: string, email: string) => {
    setInvitingId(id);
    try {
      await inviteApplicant(id).unwrap();
      toast.success(t("inviteSent", { email }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("inviteError")));
    } finally {
      setInvitingId(null);
    }
  };

  // Resolves to whether the rejection went through, so the confirmation dialog knows to close.
  const reject = async (id: string, email: string) => {
    setRejectingId(id);
    try {
      await rejectApplicant(id).unwrap();
      toast.success(t("rejectSent", { email }));
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("rejectError")));
      return false;
    } finally {
      setRejectingId(null);
    }
  };

  return {
    applications: data?.data ?? [],
    total: data?.meta.total ?? 0,
    page,
    totalPages,
    goToPage: (next: number) => setPage(Math.min(Math.max(next, 1), totalPages)),
    isLoading,
    isFetching,
    isError,
    refetch,
    invitingId,
    sendInvite,
    rejectingId,
    reject,
  };
};
