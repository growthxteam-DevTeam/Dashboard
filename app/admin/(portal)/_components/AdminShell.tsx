"use client";

import { useEffect, type ReactNode } from "react";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { logout, selectIsAdmin } from "@/redux/features/auth/authSlice";

// Client-side gate for the admin pages: anyone without an admin session is sent to the admin login.
// It only hides the UI; the backend's AdminGuard is what actually protects the data.
const AdminShell = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("Admin.shell");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = useAppSelector(selectIsAdmin);
  const adminName = useAppSelector((state) => state.auth.user?.name);

  useEffect(() => {
    if (!token || !isAdmin) router.replace("/admin/login");
  }, [token, isAdmin, router]);

  if (!token || !isAdmin) return null;

  return (
    <>
      <header className="border-b border-border bg-sidebar">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Image src="/img/logo-icon.png" alt="" width={192} height={192} loading="eager" className="size-9" />
            <span className="truncate text-lg font-bold text-primary">Growth Space</span>
            <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-primary">{t("title")}</span>
          </div>

          <div className="flex items-center gap-3">
            {adminName && <span className="hidden text-sm text-muted-foreground sm:inline">{adminName}</span>}
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outline" size="lg" onClick={() => dispatch(logout())} className="cursor-pointer">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">{children}</main>
    </>
  );
};

export default AdminShell;
