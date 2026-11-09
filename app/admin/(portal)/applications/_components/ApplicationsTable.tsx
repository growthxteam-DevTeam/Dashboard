"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight, Eye, Loader, Mail, UserX } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminApplication } from "@/redux/features/admin/adminApi";

import { useAdminApplications } from "../_hooks/useAdminApplications";
import { useOptionLabel } from "../_lib/useOptionLabel";
import ApplicationDetailsDialog from "./ApplicationDetailsDialog";
import RejectApplicationDialog from "./RejectApplicationDialog";
import StatusBadge from "./StatusBadge";

const ApplicationsTable = () => {
  const t = useTranslations("Admin.applications");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const {
    applications,
    total,
    page,
    totalPages,
    goToPage,
    isLoading,
    isFetching,
    isError,
    refetch,
    invitingId,
    sendInvite,
    rejectingId,
    reject,
  } = useAdminApplications();
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [toReject, setToReject] = useState<AdminApplication | null>(null);
  const isActing = invitingId !== null || rejectingId !== null;

  const confirmReject = async () => {
    if (!toReject) return;
    const rejected = await reject(toReject.id, toReject.applicationPortal.email);
    if (rejected) setToReject(null);
  };

  const formatDate = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "medium" });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {!isLoading && !isError && <p className="text-sm font-medium text-primary">{t("count", { count: total })}</p>}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="size-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-muted-foreground">{t("loadError")}</p>
            <Button variant="outline" size="lg" onClick={() => refetch()} className="cursor-pointer">
              {t("retry")}
            </Button>
          </div>
        ) : applications.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">{t("columns.applicant")}</TableHead>
                  <TableHead>{t("columns.business")}</TableHead>
                  <TableHead>{t("columns.program")}</TableHead>
                  <TableHead>{t("columns.applied")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead className="px-4 text-right">{t("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => {
                  const { applicationPortal, personalInfo } = application;
                  const isInviting = invitingId === application.id;

                  return (
                    <TableRow key={application.id}>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={applicationPortal.fullName} src={application.submit?.passportPhotoUrl} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-primary">{applicationPortal.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">{applicationPortal.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate">{personalInfo.businessName}</TableCell>
                      <TableCell className="whitespace-normal">
                        <p>{optionLabel("program", applicationPortal.program)}</p>
                        {applicationPortal.cohort && (
                          <p className="text-xs text-muted-foreground">
                            {optionLabel("cohort", applicationPortal.cohort)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(application.createdAt)}</TableCell>
                      <TableCell>
                        <StatusBadge status={application.status} />
                        {application.hasAccount ? (
                          <p className="mt-1 text-xs text-muted-foreground">{t("accountCreated")}</p>
                        ) : (
                          application.invitedAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t("invitedOn", {
                                date: formatDate(application.invitedAt),
                              })}
                            </p>
                          )
                        )}
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setSelected(application)}
                            className="cursor-pointer"
                          >
                            <Eye className="size-4" />
                            {t("view")}
                          </Button>
                          <Button
                            size="lg"
                            variant={application.invitedAt ? "outline" : "default"}
                            disabled={application.hasAccount || isActing}
                            onClick={() => sendInvite(application.id, applicationPortal.email)}
                            className="cursor-pointer"
                          >
                            {isInviting ? <Loader className="size-4 animate-spin" /> : <Mail className="size-4" />}
                            {isInviting ? t("inviting") : application.invitedAt ? t("resend") : t("invite")}
                          </Button>
                          <Button
                            size="lg"
                            variant="destructive"
                            disabled={application.hasAccount || application.status === "rejected" || isActing}
                            onClick={() => setToReject(application)}
                            className="cursor-pointer"
                          >
                            <UserX className="size-4" />
                            {t("reject")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && !isError && applications.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">{t("pagination.pageOf", { page, total: totalPages })}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={t("pagination.previous")}
                disabled={page <= 1 || isFetching}
                onClick={() => goToPage(page - 1)}
                className="cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={t("pagination.next")}
                disabled={page >= totalPages || isFetching}
                onClick={() => goToPage(page + 1)}
                className="cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <RejectApplicationDialog
        application={toReject}
        isRejecting={rejectingId !== null}
        onConfirm={confirmReject}
        onClose={() => setToReject(null)}
      />

      <ApplicationDetailsDialog application={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default ApplicationsTable;
