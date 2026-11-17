import Image from "next/image";
import Link from "next/link";
import { getPortfolio } from "@/lib/db";
import { projectPlaceholder } from "@/lib/project-placeholder";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const { projects } = getPortfolio();

  return (
    <main className="all-projects-page">
      <header className="nav">
        <Link href="/#home" className="brand"><b>IF</b><span>Ibrahim Fawwaz</span></Link>
        <nav><Link href="/#home">Home</Link><Link href="/#about">About</Link><Link href="/#skills">Skills</Link><Link className="active" href="/#projects">Projects</Link><Link href="/#achievements">Achievements</Link><Link href="/#certifications">Certifications</Link><Link href="/#testimonials">Collaboration Note</Link><Link href="/#contact">Contact</Link></nav>
        <Link className="button primary nav-cta" href="/#contact">Hire Me</Link>
      </header>

      <section className="all-projects project-detail-enter">
        <div className="all-projects-header"><p className="eyebrow">PROJECTS</p><h1>All Projects</h1><p>Browse cybersecurity, web development, and UI/UX work built with clarity and practical impact.</p></div>
        <div className="projects-grid">{projects.map((project) => <article className="project-card" key={project.id}><div className="project-image">{project.imageUrl ? <Image src={project.imageUrl} alt={`${project.title} project thumbnail`} width={800} height={600} unoptimized /> : <Image src={projectPlaceholder(project)} alt={`${project.title} project placeholder`} width={800} height={600} />}</div><div className="project-content"><small>{project.category}</small><h2>{project.title}</h2><p>{project.description}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link className="project-link" href={`/projects/${project.id}`}>View Project <span>→</span></Link></div></article>)}</div>
        <div className="all-projects-cta"><Link className="button primary" href="/#contact">Start A Project</Link></div>
      </section>
    </main>
  );
}
