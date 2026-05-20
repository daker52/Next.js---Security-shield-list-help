"use server";

import { auth } from "@/lib/auth";
import { updateDisplayName } from "@/lib/db/users";
import { sanitizeString } from "@/lib/security/sanitize";
import { updateProfileSchema } from "@/server/validations/profile";

import type { ActionResult } from "@/server/actions/auth";

export async function updateProfileAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateProfileSchema.safeParse({
    displayName: sanitizeString(formData.get("displayName"), 64),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const updated = await updateDisplayName(
    session.user.id,
    parsed.data.displayName,
  );

  if (!updated) {
    return { success: false, error: "User not found" };
  }

  return { success: true, message: "Profile updated" };
}
