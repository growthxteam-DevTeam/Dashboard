import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/redux/ReduxProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <ReduxProvider>
        {children}
        <Toaster position="top-right" richColors />
      </ReduxProvider>
    </ThemeProvider>
  );
};

export default Providers;
