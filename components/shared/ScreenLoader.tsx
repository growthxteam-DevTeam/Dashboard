"use client";

import Image from "next/image";

export default function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/40 backdrop-blur-[3px]">
      <div className="flex flex-col items-center gap-3 bg-background/80 px-10 py-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <Image src="/img/logo-icon.png" alt="Growth Space" width={192} height={192} loading="eager" className="size-12" />
        </div>

        <div className="w-40 h-0.75 bg-muted rounded-full overflow-hidden mt-1">
          <div className="h-full w-1/3 bg-primary rounded-full animate-[progress_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
