"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addMessage, deleteRecord, updateCv, updateProfileImage, upsertCertificate, upsertProject, upsertSkill, upsertTestimonial } from "@/lib/db";
import { isAdmin, login, logout } from "@/lib/auth";

const text = (form: FormData, key: string) => String(form.get(key) || "").trim();
const id = (form: FormData) => Number(form.get("id") || 0);
async function adminOnly() { if (!(await isAdmin())) redirect("/admin/login"); }
function refresh() { revalidatePath("/"); revalidatePath("/admin"); }

export async function sendMessage(form: FormData) {
  const name = text(form, "name"), email = text(form, "email"), message = text(form, "message");
  if (!name || !email.includes("@") || !message) redirect("/#contact?error=Lengkapi-nama-email-dan-pesan");
  addMessage(name, email, message); redirect("/#contact?sent=1");
}
export async function loginAdmin(form: FormData) { if (!(await login(text(form, "password")))) redirect("/admin/login?error=Incorrect+password"); redirect("/admin"); }
export async function logoutAdmin() { await logout(); redirect("/"); }
export async function saveProject(form: FormData) { await adminOnly(); upsertProject({ id: id(form), title: text(form, "title"), category: text(form, "category"), description: text(form, "description"), tags: text(form, "tags").split(",").map((item) => item.trim()).filter(Boolean), year: text(form, "year"), imageUrl: text(form, "imageUrl") }); refresh(); }
export async function saveCertificate(form: FormData) { await adminOnly(); upsertCertificate({ id: id(form), title: text(form, "title"), issuer: text(form, "issuer"), year: text(form, "year"), credentialUrl: text(form, "credentialUrl"), imageUrl: text(form, "imageUrl") }); refresh(); }
export async function saveTestimonial(form: FormData) { await adminOnly(); upsertTestimonial({ id: id(form), name: text(form, "name"), role: text(form, "role"), quote: text(form, "quote"), isDemo: form.get("isDemo") === "on" }); refresh(); }
export async function saveSkill(form: FormData) { await adminOnly(); upsertSkill({ id: id(form), category: text(form, "category"), name: text(form, "name"), level: text(form, "level") }); refresh(); }
export async function removeRecord(form: FormData) { await adminOnly(); const table = text(form, "table") as "projects" | "skills" | "certificates" | "testimonials"; if (["projects", "skills", "certificates", "testimonials"].includes(table)) deleteRecord(table, id(form)); refresh(); }
export async function saveCv(form: FormData) { await adminOnly(); updateCv(text(form, "cvUrl")); refresh(); }
export async function saveProfileImage(form: FormData) { await adminOnly(); updateProfileImage(text(form, "profileImageUrl")); refresh(); }
