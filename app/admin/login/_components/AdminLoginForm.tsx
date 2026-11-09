"use client";

import { Eye, EyeOff, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import ThemeToggle from "@/components/common/ThemeToggle";
import CustomFormField from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";

import { useAdminLogin } from "../_hooks/useAdminLogin";

const FieldLabelText = ({ title }: { title: string }) => (
  <span className="text-base font-bold text-primary">{title}</span>
);

const AdminLoginForm = () => {
  const { form, onSubmit, isSubmitting, showPassword, toggleShowPassword } = useAdminLogin();
  const t = useTranslations("Admin.login");

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="mx-auto my-auto w-full max-w-xl px-6 py-6">
        <div className="admin-form rounded-2xl border border-border bg-card px-6 py-8">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-primary">{t("title")}</h1>
            <p className="mt-2 text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>

          <form onSubmit={onSubmit} className="mx-auto mt-6 flex w-full max-w-md flex-col gap-4">
            <CustomFormField
              control={form.control}
              name="email"
              type="email"
              placeholder="admin@example.com"
              label={<FieldLabelText title={t("email")} />}
              leftIcon={<Mail className="size-4 text-muted-foreground" />}
            />

            <CustomFormField
              control={form.control}
              name="password"
              type={showPassword ? "text" : "password"}
              label={<FieldLabelText title={t("password")} />}
              rightIcon={
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />

            <SubmitButton isLoading={isSubmitting} loadingText={t("submitting")} className="w-full">
              {t("submit")}
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
