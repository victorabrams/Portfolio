import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const directory = path.join(process.cwd(), "data");
fs.mkdirSync(directory, { recursive: true });
const db = new DatabaseSync(path.join(directory, "portfolio.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL, tags TEXT NOT NULL, year TEXT NOT NULL, image_url TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, level TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS certificates (id INTEGER PRIMARY KEY, title TEXT NOT NULL, issuer TEXT NOT NULL, year TEXT NOT NULL, credential_url TEXT NOT NULL DEFAULT '', image_url TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, quote TEXT NOT NULL, is_demo INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`);
const total = (table) => Number(db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get().total);
if (!total("projects")) {
  const add = db.prepare("INSERT INTO projects (title, category, description, tags, year) VALUES (?, ?, ?, ?, ?)");
  add.run("CSC STELK CTF Writeups & Challenges", "Cyber Security", "Writeups, exploit scripts, OSINT notes, and CTF challenges for community training.", "CTF, Pwn, Reverse Engineering, Cryptography, OSINT, Community Leadership", "2026");
  add.run("Full-Stack Web Application", "Web Development", "A secure Laravel web platform with role-based access and responsive components.", "Laravel, PHP, Tailwind CSS", "2026");
  add.run("Figma UI/UX Prototypes", "UI/UX Design", "Interactive web and mobile prototypes designed around usability and visual clarity.", "Figma, Prototyping, UI Design", "2026");
}
if (!total("skills")) {
  const add = db.prepare("INSERT INTO skills (category, name, level) VALUES (?, ?, ?)");
  [["Software Development", "Full-Stack Development", "Advanced"], ["Software Development", "PHP / Laravel", "Intermediate"], ["Cyber Security", "Reverse Engineering", "Active CTF"], ["Cyber Security", "Binary Exploitation (Pwn)", "Active CTF"], ["Design & Prototyping", "Figma / UI Design", "Intermediate"]].forEach((skill) => add.run(...skill));
}
if (!total("certificates")) {
  const add = db.prepare("INSERT INTO certificates (title, issuer, year) VALUES (?, ?, ?)");
  add.run("Medallion of Excellence (MoE) LKSN Cyber Security 2026", "Pusat Prestasi Nasional · Issued Aug 2026", "2026");
  add.run("Full-Stack Web Developer Coding Camp 2026 powered by DBS Foundation", "Dicoding Indonesia · Issued May 2026", "2026");
  add.run("Cyber Security Officer", "PT Telkom Prima Cipta Certifia · Issued Dec 2025", "2025");
}
if (!total("testimonials")) db.prepare("INSERT INTO testimonials (name, role, quote, is_demo) VALUES (?, ?, ?, 1)").run("Contoh Testimoni", "Ganti melalui Admin", "Tambahkan testimoni asli dari klien, guru, atau rekan kerja di halaman admin.");
if (!db.prepare("SELECT value FROM settings WHERE key = ?").get("cv_url")) db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("cv_url", "");
if (!db.prepare("SELECT value FROM settings WHERE key = ?").get("profile_image_url")) db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("profile_image_url", "");
console.log("Database siap: data/portfolio.db");
