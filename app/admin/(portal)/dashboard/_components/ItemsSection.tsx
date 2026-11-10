"use client";

import { useState } from "react";

import { Loader, Pencil, Plus, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardItem, DashboardItemType } from "@/redux/features/admin/adminApi";

import { useDashboardItems } from "../_hooks/useDashboardItems";
import { useAudienceLabel } from "../_lib/useAudienceLabel";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ItemFormDialog from "./ItemFormDialog";

// Announcements, calendar events and to-do assignments share one table: only the date and points
// columns differ by type.
const ItemsSection = ({ type }: { type: DashboardItemType }) => {
  const t = useTranslations("Admin.dashboard");
  const format = useFormatter();
  const { audienceLabel } = useAudienceLabel();
  const { items, isLoading, isError, refetch, removeItem, isDeleting } = useDashboardItems(type);
  // `undefined` = form closed, `null` = adding a new item, an item = editing it.
  const [editing, setEditing] = useState<DashboardItem | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<DashboardItem | null>(null);

  const hasDate = type !== "announcement";

  return (
    <div>
      <div className="flex justify-end">
        <Button size="lg" onClick={() => setEditing(null)} className="cursor-pointer">
          <Plus className="size-4" />
          {t(`add.${type}`)}
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
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{t(`empty.${type}`)}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">{t(`columns.text.${type}`)}</TableHead>
                {hasDate && <TableHead>{t(`columns.date.${type}`)}</TableHead>}
                {type === "assignment" && <TableHead>{t("columns.points")}</TableHead>}
                <TableHead>{t("columns.audience")}</TableHead>
                <TableHead className="px-4 text-right">{t("columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-md px-4 py-3 whitespace-normal">
                    <p className="line-clamp-3 break-words whitespace-pre-wrap">{item.text}</p>
                  </TableCell>
                  {hasDate && (
                    <TableCell className="whitespace-nowrap">
                      {item.date && format.dateTime(new Date(item.date), { dateStyle: "medium", timeStyle: "short" })}
                    </TableCell>
                  )}
                  {type === "assignment" && <TableCell>{item.points}</TableCell>}
                  <TableCell className="whitespace-normal">{audienceLabel(item.program, item.cohort)}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="lg" onClick={() => setEditing(item)} className="cursor-pointer">
                        <Pencil className="size-4" />
                        {t("edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => setDeleting(item)}
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
        <ItemFormDialog key={editing?.id ?? "new"} type={type} item={editing} onClose={() => setEditing(undefined)} />
      )}

      <ConfirmDeleteDialog
        description={deleting && t("deleteDialog.itemDescription", { text: deleting.text })}
        isDeleting={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting && (await removeItem(deleting.id))) setDeleting(null);
        }}
      />
    </div>
  );
};

export default ItemsSection;
