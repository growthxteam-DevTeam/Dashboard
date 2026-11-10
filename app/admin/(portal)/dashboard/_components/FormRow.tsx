import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface FormRowProps {
  label: string;
  /** A message key from the schemas, translated under `Validation`. */
  error?: string;
  hint?: string;
  children: ReactNode;
}

// Label + control + translated error, for the dashboard forms' non-text-input controls.
const FormRow = ({ label, error, hint, children }: FormRowProps) => {
  const tv = useTranslations("Validation");

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <FieldError className="text-red-500">{tv.has(error) ? tv(error) : error}</FieldError>}
    </Field>
  );
};

export default FormRow;
