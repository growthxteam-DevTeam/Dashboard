import type { z } from "zod";

import type { adminLoginSchema } from "../_constants";

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
