"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();

  // The icon is swapped with CSS (`dark:`), so the server render and first client render match.
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-muted",
        className,
      )}
    >
      <Moon className="size-4.5 dark:hidden" />
      <Sun className="hidden size-4.5 dark:block" />
    </button>
  );
};

export default ThemeToggle;
