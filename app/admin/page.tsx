import Link from "next/link";
import { redirect } from "next/navigation";
import { getMessages, getPortfolio } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { logoutAdmin, removeRecord, saveCertificate, saveCv, saveProfileImage, saveProject, saveSkill, saveTestimonial } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const { projects, skills, certificates, testimonials, cv, profileImage } = getPortfolio();
  const messages = getMessages();
  return <main className="admin-main">
    <header className="admin-head"><div><p className="eyebrow">ADMIN DASHBOARD</p><h1 style={{ fontSize: "3rem" }}>Manage Portfolio</h1></div><div className="actions"><Link className="button secondary" href="/">View Website</Link><form action={logoutAdmin}><button className="button delete">Sign Out</button></form></div></header>
    <section className="admin-section"><h2>CV Link</h2><article className="admin-card"><form action={saveCv}><label className="full">CV URL (upload the PDF to cloud storage, then paste its URL)<input name="cvUrl" type="url" defaultValue={cv} placeholder="https://.../cv.pdf" /></label><button className="button primary">Save CV</button></form></article></section>
    <section className="admin-section"><h2>Profile Picture</h2><article className="admin-card"><form action={saveProfileImage}><label className="full">Profile picture URL (upload the image to cloud storage, then paste its direct URL)<input name="profileImageUrl" type="url" defaultValue={profileImage} placeholder="https://.../profile-picture.jpg" /></label><button className="button primary">Save Photo</button></form></article></section>
    <Manager title="Projects" table="projects" items={projects} action={saveProject} fields={["title", "category", "year", "tags", "imageUrl", "description"]} placeholders={{ tags: "Laravel, Next.js, Tailwind", imageUrl: "https://.../image.jpg" }} />
    <Manager title="Certificates" table="certificates" items={certificates} action={saveCertificate} fields={["title", "issuer", "year", "credentialUrl", "imageUrl"]} placeholders={{ credentialUrl: "https://.../credential", imageUrl: "https://.../certificate.jpg" }} />
    <Manager title="Testimonials" table="testimonials" items={testimonials} action={saveTestimonial} fields={["name", "role", "quote"]} hasDemo />
    <Manager title="Skills" table="skills" items={skills} action={saveSkill} fields={["category", "name", "level"]} />
    <section className="admin-section"><h2>Incoming Messages</h2><div className="admin-grid">{messages.length ? messages.map((message) => <article className="admin-card" key={message.id}><b>{message.name}</b><p>{message.email}</p><p>{message.message}</p><small>{message.createdAt}</small></article>) : <p className="lead">No messages yet.</p>}</div></section>
  </main>;
}

type Item = Record<string, unknown> & { id: number };
function Manager({ title, table, items, action, fields, placeholders = {}, hasDemo = false }: { title: string; table: "projects" | "skills" | "certificates" | "testimonials"; items: Item[]; action: (form: FormData) => Promise<void>; fields: string[]; placeholders?: Record<string, string>; hasDemo?: boolean }) {
  const label = (field: string) => field === "imageUrl" ? "Image URL" : field === "credentialUrl" ? "Credential URL" : field[0].toUpperCase() + field.slice(1);
  const isLongField = (field: string) => field === "description" || field === "quote";
  const fieldsFor = (item?: Item) => fields.map((field) => <label className={isLongField(field) ? "full" : ""} key={field}>{label(field)}{isLongField(field) ? <textarea name={field} rows={4} defaultValue={item ? String(item[field] ?? "") : undefined} required /> : <input name={field} defaultValue={item ? String(item[field] ?? "") : undefined} placeholder={placeholders[field]} required={field !== "imageUrl" && field !== "credentialUrl"} />}</label>);
  const sampleControl = (checked = false) => hasDemo ? <label className="sample-demo-control"><input type="checkbox" name="isDemo" defaultChecked={checked} /><span>Sample/demo</span></label> : null;
  return <section className="admin-section"><h2>{title}</h2><div className="admin-grid">{items.map((item) => <article className="admin-card" key={item.id}><form className="admin-edit-form" action={action}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="table" value={table} />{fieldsFor(item)}<div className="admin-card-actions">{sampleControl(Boolean(item.isDemo))}<div className="admin-action-buttons"><button className="button primary" type="submit">Save</button><button className="button delete" type="submit" formAction={removeRecord} formNoValidate>Delete</button></div></div></form></article>)}</div><article className="admin-card" style={{ marginTop: "1rem" }}><h3>Add {title}</h3><form className="admin-edit-form" action={action}><input type="hidden" name="id" value="0" />{fieldsFor()}<div className="admin-card-actions">{sampleControl()}<div className="admin-action-buttons"><button className="button primary" type="submit">Add</button></div></div></form></article></section>;
}
