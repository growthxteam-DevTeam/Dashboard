"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { logout } from "@/redux/features/auth/authSlice";

// Top bar above every admin page: who is signed in, language and theme, and log out.
const AdminNavbar = () => {
  const t = useTranslations("Admin.shell");
  const dispatch = useAppDispatch();
  const adminName = useAppSelector((state) => state.auth.user?.name);

  return (
    <header className="shrink-0 border-b border-border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          {/* The sidebar (and its logo) is hidden below lg, so the brand shows here instead. */}
          <Image
            src="/img/logo-icon.png"
            alt=""
            width={192}
            height={192}
            loading="eager"
            className="size-8 lg:hidden"
          />
          <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-primary">{t("title")}</span>
          {adminName && <span className="hidden truncate text-sm text-muted-foreground sm:inline">{adminName}</span>}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="outline" size="lg" onClick={() => dispatch(logout())} className="cursor-pointer">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
