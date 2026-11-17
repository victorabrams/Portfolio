import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "portfolio_admin";
const secret = process.env.ADMIN_SESSION_SECRET || "ganti-rahasia-admin-untuk-produksi";
const password = process.env.ADMIN_PASSWORD || "ukk-admin-2026";

function signature(value: string) { return createHmac("sha256", secret).update(value).digest("hex"); }

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return false;
  const [payload, received] = value.split(".");
  if (!payload || !received || !/^[a-f0-9]{64}$/.test(received)) return false;
  return timingSafeEqual(Buffer.from(signature(payload), "hex"), Buffer.from(received, "hex"));
}

export async function login(candidate: string) {
  if (candidate !== password) return false;
  const payload = `admin:${Date.now()}`;
  (await cookies()).set(cookieName, `${payload}.${signature(payload)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8, path: "/" });
  return true;
}

export async function logout() { (await cookies()).delete(cookieName); }
