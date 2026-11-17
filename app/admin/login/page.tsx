import Link from "next/link";
import { loginAdmin } from "@/app/actions";
import PasswordField from "./password-field";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="login">
      <form action={loginAdmin} className="card">
        <p className="eyebrow">ADMIN PORTFOLIO</p>
        <h1 style={{ fontSize: "2.4rem" }}>Sign In</h1>
        <p className="lead">Manage projects, certificates, testimonials, skills, CV, and messages.</p>
        {error && <p className="notice">{error}</p>}
        <PasswordField />
        <button className="button primary" type="submit">Sign In to Dashboard</button>
        <Link className="admin-link" href="/">← Back to Portfolio</Link>
      </form>
    </main>
  );
}
