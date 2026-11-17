import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export type Project = { id: number; title: string; category: string; description: string; tags: string[]; year: string; imageUrl: string };
export type Skill = { id: number; category: string; name: string; level: string };
export type Certificate = { id: number; title: string; issuer: string; year: string; credentialUrl: string; imageUrl: string };
export type Testimonial = { id: number; name: string; role: string; quote: string; isDemo: boolean };
export type Message = { id: number; name: string; email: string; message: string; createdAt: string };

const db = new DatabaseSync(path.join(process.cwd(), "data", "portfolio.db"));

function rows<T>(query: string, ...params: unknown[]): T[] { return db.prepare(query).all(...params) as T[]; }

export function getPortfolio() {
  const projects = rows<Omit<Project, "tags" | "imageUrl"> & { tags: string; image_url: string }>("SELECT * FROM projects ORDER BY id ASC").map((item) => ({ ...item, tags: item.tags.split(",").map((tag) => tag.trim()).filter(Boolean), imageUrl: item.image_url }));
  const skills = rows<Skill>("SELECT * FROM skills ORDER BY CASE category WHEN 'Cyber Security' THEN 1 WHEN 'Design & Prototyping' THEN 2 WHEN 'Software Development' THEN 3 WHEN 'Community Leadership' THEN 4 ELSE 5 END, id");
  const certificates = rows<Omit<Certificate, "credentialUrl" | "imageUrl"> & { credential_url: string; image_url: string }>("SELECT * FROM certificates ORDER BY id ASC").map((item) => ({ ...item, credentialUrl: item.credential_url, imageUrl: item.image_url }));
  const testimonials = rows<Omit<Testimonial, "isDemo"> & { is_demo: number }>("SELECT * FROM testimonials ORDER BY id DESC").map((item) => ({ ...item, isDemo: Boolean(item.is_demo) }));
  const setting = (key: string) => (db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined)?.value ?? "";
  const cv = setting("cv_url");
  const profileImage = setting("profile_image_url");
  return { projects, skills, certificates, testimonials, cv, profileImage };
}

export function getProject(id: number): Project | null {
  const item = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as (Omit<Project, "tags" | "imageUrl"> & { tags: string; image_url: string }) | undefined;
  return item ? { ...item, tags: item.tags.split(",").map((tag) => tag.trim()).filter(Boolean), imageUrl: item.image_url } : null;
}

export function getProjectOverview(project: Project): string[] {
  const overviewByTitle: Record<string, string[]> = {
    "CSC STELK CTF Writeups & Challenges": [
      "This repository documents CTF writeups and responsible proof-of-concept scripts across Reverse Engineering, Binary Exploitation (Pwn), Cryptography, and Open-Source Intelligence (OSINT).",
      "As a CSC STELK initiative, it also includes original challenges and training materials for workshops, mentorship, and collaborative community learning.",
    ],
    "Full-Stack Web Application": [
      "A full-stack web platform combining Laravel/PHP services with Node.js/Express integrations and React/Next.js interfaces, supported by modular data management and scalable API endpoints.",
      "The application applies role-based access control, secure authentication, responsive Tailwind CSS components, and clear frontend-backend workflows for practical business use.",
    ],
    "Figma UI/UX Prototypes": [
      "A UI/UX design collection grounded in UX research, user flows, wireframing, and visual clarity for web and mobile experiences.",
      "The prototypes demonstrate interactive states, reusable Figma components, and responsive web layouts that support clear navigation and usability.",
    ],
  };

  return overviewByTitle[project.title] ?? [project.description];
}

export function getMessages(): Message[] { return rows<Message>("SELECT id, name, email, message, created_at as createdAt FROM messages ORDER BY id DESC"); }
export function addMessage(name: string, email: string, message: string) { db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)").run(name, email, message); }
export function upsertProject(data: Omit<Project, "imageUrl"> & { imageUrl: string }) { if (data.id) db.prepare("UPDATE projects SET title=?, category=?, description=?, tags=?, year=?, image_url=? WHERE id=?").run(data.title, data.category, data.description, data.tags.join(", "), data.year, data.imageUrl, data.id); else db.prepare("INSERT INTO projects (title, category, description, tags, year, image_url) VALUES (?, ?, ?, ?, ?, ?)").run(data.title, data.category, data.description, data.tags.join(", "), data.year, data.imageUrl); }
export function upsertCertificate(data: Certificate) { if (data.id) db.prepare("UPDATE certificates SET title=?, issuer=?, year=?, credential_url=?, image_url=? WHERE id=?").run(data.title, data.issuer, data.year, data.credentialUrl, data.imageUrl, data.id); else db.prepare("INSERT INTO certificates (title, issuer, year, credential_url, image_url) VALUES (?, ?, ?, ?, ?)").run(data.title, data.issuer, data.year, data.credentialUrl, data.imageUrl); }
export function upsertTestimonial(data: Testimonial) { if (data.id) db.prepare("UPDATE testimonials SET name=?, role=?, quote=?, is_demo=? WHERE id=?").run(data.name, data.role, data.quote, Number(data.isDemo), data.id); else db.prepare("INSERT INTO testimonials (name, role, quote, is_demo) VALUES (?, ?, ?, ?)").run(data.name, data.role, data.quote, Number(data.isDemo)); }
export function upsertSkill(data: Skill) { if (data.id) db.prepare("UPDATE skills SET category=?, name=?, level=? WHERE id=?").run(data.category, data.name, data.level, data.id); else db.prepare("INSERT INTO skills (category, name, level) VALUES (?, ?, ?)").run(data.category, data.name, data.level); }
export function deleteRecord(table: "projects" | "skills" | "certificates" | "testimonials", id: number) { db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id); }
export function updateCv(url: string) { db.prepare("UPDATE settings SET value = ? WHERE key = 'cv_url'").run(url); }
export function updateProfileImage(url: string) {
  db.prepare("INSERT INTO settings (key, value) VALUES ('profile_image_url', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(url);
}
