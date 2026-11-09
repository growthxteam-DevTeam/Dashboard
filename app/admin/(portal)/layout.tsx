import type { ReactNode } from "react";

import AdminShell from "./_components/AdminShell";

const AdminPortalLayout = ({ children }: { children: ReactNode }) => <AdminShell>{children}</AdminShell>;

export default AdminPortalLayout;
