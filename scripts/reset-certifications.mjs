import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/portfolio.db");
db.exec("DELETE FROM certificates;");
const add = db.prepare("INSERT INTO certificates (title, issuer, year, credential_url, image_url) VALUES (?, ?, ?, ?, ?)");
add.run("Medallion of Excellence (MoE) LKSN Cyber Security 2026", "Pusat Prestasi Nasional · Issued Aug 2026", "2026", "", "");
add.run("Full-Stack Web Developer Coding Camp 2026 powered by DBS Foundation", "Dicoding Indonesia · Issued May 2026", "2026", "", "");
add.run("Cyber Security Officer", "PT Telkom Prima Cipta Certifia · Issued Dec 2025", "2025", "", "");
console.log("Certifications updated.");
