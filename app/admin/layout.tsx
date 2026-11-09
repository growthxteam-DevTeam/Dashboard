import type { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-page">{children}</div>
);

export default AdminLayout;
