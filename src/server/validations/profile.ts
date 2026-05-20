import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(64).trim(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
