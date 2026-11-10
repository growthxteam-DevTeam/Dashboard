"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { DashboardItemType } from "@/redux/features/admin/adminApi";

import { ITEM_TYPES } from "../_constants";
import BannersSection from "./BannersSection";
import ItemsSection from "./ItemsSection";

type TabId = "banners" | DashboardItemType;

const TABS: TabId[] = ["banners", ...ITEM_TYPES];

const DashboardContent = () => {
  const t = useTranslations("Admin.dashboard");
  const [activeTab, setActiveTab] = useState<TabId>("banners");

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div role="tablist" className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-tint p-1 sm:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              activeTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary",
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "banners" ? <BannersSection /> : <ItemsSection key={activeTab} type={activeTab} />}
      </div>
    </div>
  );
};

export default DashboardContent;
