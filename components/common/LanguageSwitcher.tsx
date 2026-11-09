"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const LanguageSwitcher = () => {
  const t = useTranslations("Header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;

    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={t("language")}
        disabled={isPending}
        className="flex cursor-pointer items-center gap-1.5 text-base font-semibold text-primary disabled:opacity-60"
      >
        <Globe className="size-5" />
        {LOCALE_LABELS[locale]}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-40 gap-0.5 p-1">
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onSelect(code)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-sm hover:bg-muted",
              code === locale && "font-semibold text-primary",
            )}
          >
            {LOCALE_LABELS[code]}
            {code === locale && <Check className="size-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
