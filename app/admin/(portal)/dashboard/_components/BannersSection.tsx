"use client";

import { useState } from "react";

import { Loader, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardBanner } from "@/redux/features/admin/adminApi";

import { useBanners } from "../_hooks/useBanners";
import { useAudienceLabel } from "../_lib/useAudienceLabel";
import BannerFormDialog from "./BannerFormDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const BannersSection = () => {
  const t = useTranslations("Admin.dashboard");
  const { audienceLabel } = useAudienceLabel();
  const { banners, isLoading, isError, refetch, removeBanner, isDeleting } = useBanners();
  // `undefined` = form closed, `null` = adding a new banner, a banner = editing it.
  const [editing, setEditing] = useState<DashboardBanner | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<DashboardBanner | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("bannersHint")}</p>
        <Button size="lg" onClick={() => setEditing(null)} className="shrink-0 cursor-pointer">
          <Plus className="size-4" />
          {t("add.banner")}
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card">
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
        ) : banners.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{t("empty.banner")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">{t("columns.audience")}</TableHead>
                <TableHead>{t("columns.title")}</TableHead>
                <TableHead>{t("columns.duration")}</TableHead>
                <TableHead>{t("columns.leader")}</TableHead>
                <TableHead>{t("columns.members")}</TableHead>
                <TableHead className="px-4 text-right">{t("columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="px-4 py-3 whitespace-normal">
                    {audienceLabel(banner.program, banner.cohort)}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{banner.title}</TableCell>
                  <TableCell className="whitespace-nowrap">{t("weeks", { count: banner.durationWeeks })}</TableCell>
                  <TableCell>{banner.leader}</TableCell>
                  <TableCell>{banner.cohortMembers}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="lg" onClick={() => setEditing(banner)} className="cursor-pointer">
                        <Pencil className="size-4" />
                        {t("edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => setDeleting(banner)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                        {t("delete")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing !== undefined && (
        <BannerFormDialog key={editing?.id ?? "new"} banner={editing} onClose={() => setEditing(undefined)} />
      )}

      <ConfirmDeleteDialog
        description={
          deleting &&
          t("deleteDialog.bannerDescription", { audience: audienceLabel(deleting.program, deleting.cohort) })
        }
        isDeleting={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting && (await removeBanner(deleting.id))) setDeleting(null);
        }}
      />
    </div>
  );
};

export default BannersSection;
