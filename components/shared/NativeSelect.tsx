import * as React from "react";

import { cn } from "@/lib/utils";

// A plain <select> styled like `Input`. Used for short, fixed lists (program, cohort) where the
// browser's own picker is the better experience, especially on phones.
const NativeSelect = ({ className, children, ...props }: React.ComponentProps<"select">) => (
  <select
    className={cn(
      "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:border-field-focus disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30",
      className,
    )}
    {...props}
  >
    {children}
  </select>
);

export default NativeSelect;
