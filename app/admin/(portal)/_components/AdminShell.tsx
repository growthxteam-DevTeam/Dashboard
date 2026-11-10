"use client";

import { useEffect, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/app/hooks";
import { selectIsAdmin } from "@/redux/features/auth/authSlice";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

// Client-side gate for the admin pages: anyone without an admin session is sent to the admin login.
// It only hides the UI; the backend's AdminGuard is what actually protects the data.
const AdminShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    if (!token || !isAdmin) router.replace("/admin/login");
  }, [token, isAdmin, router]);

  if (!token || !isAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar is the left column on desktop and a fixed bottom bar on mobile. */}
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 lg:px-8 lg:pb-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
