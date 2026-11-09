import { useTranslations } from "next-intl";

// Turns a stored option value (e.g. "1-3-years") into the label the applicant saw in the form.
// Falls back to the raw value for anything the form no longer offers.
export const useOptionLabel = () => {
  const t = useTranslations("Onboarding.options");

  return (group: string, value: string) => {
    const key = `${group}.${value}`;
    return t.has(key) ? t(key) : value;
  };
};
