import { useTranslations } from "next-intl";

// "Zero to Launch (6 weeks)" -> "Zero to Launch": the audience label is about who, not how long.
const stripWeeks = (label: string) => label.replace(/\s*\(.*\)$/, "");

// Names a program/cohort pair for tables and dialogs. Programs that are no longer in the form's list
// (older applications) fall back to the stored value.
export const useAudienceLabel = () => {
  const t = useTranslations("Admin.dashboard.audience");
  const tPrograms = useTranslations("Onboarding.options.program");
  const tCohorts = useTranslations("Onboarding.options.cohort");

  const programLabel = (program: string | null) =>
    program === null ? t("allPrograms") : stripWeeks(tPrograms.has(program) ? tPrograms(program) : program);
  const cohortLabel = (cohort: string | null) =>
    cohort === null ? t("allCohorts") : tCohorts.has(cohort) ? tCohorts(cohort) : cohort;

  const audienceLabel = (program: string | null, cohort: string | null) =>
    program === null && cohort === null ? t("everyone") : `${programLabel(program)} · ${cohortLabel(cohort)}`;

  return { programLabel, cohortLabel, audienceLabel };
};
