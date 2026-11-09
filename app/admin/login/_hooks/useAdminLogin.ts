"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { useAppDispatch } from "@/redux/app/hooks";
import { useAdminLoginMutation } from "@/redux/features/auth/authApi";
import { ADMIN_ROLE_TITLE, setCredentials } from "@/redux/features/auth/authSlice";

import { adminLoginSchema } from "../_constants";
import type { AdminLoginValues } from "../_types";

export const useAdminLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("Admin.login");
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Never log these values — they include the password.
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { data } = await adminLogin(values).unwrap();
      dispatch(
        setCredentials({
          token: data.accessToken,
          user: {
            id: data.admin.id,
            name: data.admin.name,
            email: data.admin.email,
            profilePicture: null,
            role: { title: ADMIN_ROLE_TITLE },
          },
        }),
      );
      toast.success(t("welcomeToast"));
      router.push("/admin/applications");
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("error")));
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: isLoading,
    showPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
  };
};
