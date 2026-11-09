import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("emailInvalid").trim(),
  password: z.string().min(1, "passwordRequired"),
});
