import { ClipboardList, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface SidebarLink {
  /** Key under the `Admin.shell.nav` translations. */
  key: "applications" | "dashboard";
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { key: "applications", href: "/admin/applications", icon: ClipboardList },
  { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
];
