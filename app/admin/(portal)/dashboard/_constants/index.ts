import { z } from "zod";

import type { DashboardItemType } from "@/redux/features/admin/adminApi";

// Mirror the applicant form's option values (growth-x onboarding) and the backend's
// dashboard.constants.ts. Labels come from `Onboarding.options.program.<value>` / `cohort.<value>`.
export const PROGRAM_VALUES = [
  "zero-to-launch",
  "build-for-funding",
  "scale-your-sales",
  "price-for-profit",
  "lead-your-team",
] as const;

export const COHORT_VALUES = ["cohort-1", "cohort-2", "cohort-3", "cohort-4"] as const;

export const ITEM_TYPES: DashboardItemType[] = ["announcement", "event", "assignment"];

export const ITEM_TEXT_MAX_LENGTH = 500;
export const MAX_POINTS = 1000;
export const MAX_WEEKS = 104;

// Form fields are all strings (that's what inputs give us); "" in program/cohort means "everyone".
export const buildItemSchema = (type: DashboardItemType) =>
  z
    .object({
      program: z.string(),
      cohort: z.string(),
      text: z.string().trim().min(1, "textRequired").max(ITEM_TEXT_MAX_LENGTH, "textMax"),
      date: z.string(),
      points: z.string(),
    })
    .superRefine((values, ctx) => {
      if (type !== "announcement" && !values.date) {
        ctx.addIssue({ code: "custom", path: ["date"], message: "dateRequired" });
      }
      if (type === "assignment") {
        const points = Number(values.points);
        if (!/^\d+$/.test(values.points) || points > MAX_POINTS) {
          ctx.addIssue({ code: "custom", path: ["points"], message: "pointsInvalid" });
        }
      }
    });

export const bannerSchema = z.object({
  program: z.string().min(1, "programRequired"),
  cohort: z.string().min(1, "cohortRequired"),
  title: z.string().trim().min(1, "titleRequired").max(100, "titleMax"),
  durationWeeks: z
    .string()
    .regex(/^\d+$/, "weeksInvalid")
    .refine((value) => Number(value) >= 1 && Number(value) <= MAX_WEEKS, "weeksInvalid"),
  leader: z.string().trim().min(1, "leaderRequired").max(100, "leaderMax"),
  cohortMembers: z.string().regex(/^\d+$/, "membersInvalid"),
});
