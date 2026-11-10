import type { z } from "zod";

import type { bannerSchema, buildItemSchema } from "../_constants";

export type ItemFormValues = z.infer<ReturnType<typeof buildItemSchema>>;
export type BannerFormValues = z.infer<typeof bannerSchema>;
