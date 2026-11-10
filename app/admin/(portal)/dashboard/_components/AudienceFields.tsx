import { useTranslations } from "next-intl";
import type { UseFormRegisterReturn } from "react-hook-form";

import NativeSelect from "@/components/shared/NativeSelect";

import { COHORT_VALUES, PROGRAM_VALUES } from "../_constants";
import { useAudienceLabel } from "../_lib/useAudienceLabel";
import FormRow from "./FormRow";

interface AudienceFieldsProps {
  // Both the item form and the banner form have these two string fields; each passes its own `register`.
  register: (name: "program" | "cohort") => UseFormRegisterReturn;
  /** Message keys from the form's schema. */
  errors: { program?: string; cohort?: string };
  /** Items can be addressed to everyone; a banner always names one program and cohort. */
  allowEveryone: boolean;
}

const AudienceFields = ({ register, errors, allowEveryone }: AudienceFieldsProps) => {
  const t = useTranslations("Admin.dashboard.audience");
  const { programLabel, cohortLabel } = useAudienceLabel();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormRow label={t("program")} error={errors.program}>
        <NativeSelect aria-invalid={!!errors.program} {...register("program")}>
          <option value="">{allowEveryone ? t("allPrograms") : t("select")}</option>
          {PROGRAM_VALUES.map((value) => (
            <option key={value} value={value}>
              {programLabel(value)}
            </option>
          ))}
        </NativeSelect>
      </FormRow>

      <FormRow label={t("cohort")} error={errors.cohort}>
        <NativeSelect aria-invalid={!!errors.cohort} {...register("cohort")}>
          <option value="">{allowEveryone ? t("allCohorts") : t("select")}</option>
          {COHORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {cohortLabel(value)}
            </option>
          ))}
        </NativeSelect>
      </FormRow>
    </div>
  );
};

export default AudienceFields;
