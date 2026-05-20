import "server-only";

import bcrypt from "bcryptjs";

export type UserRecord = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: Date;
};

/** In-memory store for demo only — replace with Prisma/Drizzle in production */
const users = new Map<string, UserRecord>();

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | undefined> {
  const normalized = email.toLowerCase();
  for (const user of users.values()) {
    if (user.email === normalized) return user;
  }
  return undefined;
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  return users.get(id);
}

export async function createUser(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<UserRecord> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("User already exists");
  }

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user: UserRecord = {
    id,
    email: input.email.toLowerCase(),
    displayName: input.displayName,
    passwordHash,
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
}

export async function verifyPassword(
  user: UserRecord,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateDisplayName(
  userId: string,
  displayName: string,
): Promise<UserRecord | undefined> {
  const user = users.get(userId);
  if (!user) return undefined;
  user.displayName = displayName;
  users.set(userId, user);
  return user;
}
