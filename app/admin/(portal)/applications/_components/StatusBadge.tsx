import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { AdminApplication } from "@/redux/features/admin/adminApi";

const STATUS_STYLES: Record<AdminApplication["status"], string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  reviewed: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

const StatusBadge = ({ status }: { status: AdminApplication["status"] }) => {
  const t = useTranslations("Admin.applications.status");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </span>
  );
};

export default StatusBadge;
