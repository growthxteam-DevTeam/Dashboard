"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CustomFormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type?: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

// A react-hook-form text input with label, optional icons and a translated error message.
const CustomFormField = <T extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
  disabled,
  readOnly,
  rightIcon,
  leftIcon,
}: CustomFormFieldProps<T>) => {
  const tv = useTranslations("Validation");
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  // Schemas carry message keys; anything else (e.g. zod defaults) is shown as-is.
  const errorMessage = error?.message ? (tv.has(error.message) ? tv(error.message) : String(error.message)) : undefined;

  return (
    <Field className="flex-1" data-invalid={!!error}>
      {label && <FieldLabel className="text-14 w-full max-w-70 font-medium text-description">{label}</FieldLabel>}

      <div className="relative flex items-center rounded border border-primary transition-colors focus-within:border-field-focus focus-within:ring-0">
        {leftIcon && <div className="absolute left-3 z-10 mb-1 cursor-pointer">{leftIcon}</div>}

        <Input
          placeholder={placeholder}
          {...field}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          className={`h-11 w-full rounded-[5px] border-0 bg-muted text-16 text-foreground placeholder:text-16 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-10" : ""}`}
        />

        {rightIcon && <div className="absolute right-3 z-10 mb-1 cursor-pointer">{rightIcon}</div>}
      </div>

      {errorMessage && <FieldError className="text-red-500">{errorMessage}</FieldError>}
    </Field>
  );
};

export default CustomFormField;
