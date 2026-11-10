"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { SIDEBAR_LINKS } from "../_constants";

const AdminSidebar = () => {
  const t = useTranslations("Admin.shell.nav");
  const pathname = usePathname();

  const navLinks = SIDEBAR_LINKS.map(({ key, href, icon: Icon }) => ({
    key,
    href,
    Icon,
    isActive: pathname.startsWith(href),
  }));

  return (
    <>
      {/* ── Desktop: left sidebar ── */}
      <aside className="hidden h-full w-28 shrink-0 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar px-2 py-6 lg:flex">
        <Link href="/admin/applications" className="mb-3 flex flex-col items-center gap-1">
          <Image
            src="/img/logo-icon.png"
            alt="Growth Space"
            width={192}
            height={192}
            loading="eager"
            className="size-12"
          />
          <span className="text-[11px] font-semibold text-sidebar-foreground">Growth Space</span>
        </Link>

        <nav className="mt-6 flex w-full flex-col gap-3">
          {navLinks.map(({ key, href, Icon, isActive }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex w-full flex-col items-center gap-1.5 rounded-lg px-1 py-4 text-center text-xs leading-tight font-semibold transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="size-7" strokeWidth={1.5} />
              {t(key)}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Mobile: fixed bottom nav bar ── */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t border-sidebar-border bg-sidebar px-2 py-2 lg:hidden">
        {navLinks.map(({ key, href, Icon, isActive }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-6 py-2 text-[10px] font-semibold transition-colors",
              isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
            )}
          >
            <Icon className="size-6" strokeWidth={1.5} />
            {t(key)}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default AdminSidebar;
