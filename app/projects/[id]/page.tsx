import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio, getProject, getProjectOverview } from "@/lib/db";
import { projectPlaceholder } from "@/lib/project-placeholder";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(Number(id));

  if (!project) notFound();

  const overview = getProjectOverview(project);
  const relatedProjects = getPortfolio().projects.filter((item) => item.id !== project.id);

  return (
    <main className="project-detail-page">
      <header className="nav">
        <Link href="/#home" className="brand"><b>IF</b><span>Ibrahim Fawwaz</span></Link>
        <nav><Link href="/#home">Home</Link><Link href="/#about">About</Link><Link href="/#skills">Skills</Link><Link className="active" href="/#projects">Projects</Link><Link href="/#achievements">Achievements</Link><Link href="/#certifications">Certifications</Link><Link href="/#testimonials">Collaboration Note</Link><Link href="/#contact">Contact</Link></nav>
        <Link className="button primary nav-cta" href="/#contact">Hire Me</Link>
      </header>

      <article className="project-detail project-detail-enter">
        <Link className="back-link" href="/#projects">← <span>Back to projects</span></Link>
        <p className="eyebrow">{project.category} · {project.year}</p>
        <h1>{project.title}</h1>
        <p className="detail-intro">{project.description}</p>
        <div className="detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

        <div className="detail-image">
          {project.imageUrl ? <Image src={project.imageUrl} alt={`${project.title} showcase image`} width={1200} height={675} unoptimized priority /> : <Image src={projectPlaceholder(project)} alt={`${project.title} project placeholder`} width={1200} height={675} priority />}
        </div>

        <div className="project-overview">
          <div><h2>Project Overview</h2>{overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <aside><h3>Details</h3><dl><div><dt>Category</dt><dd>{project.category}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Services</dt><dd>{project.tags.join(", ")}</dd></div></dl><Link className="button primary" href="/#contact">Discuss a similar project</Link></aside>
        </div>
      </article>

      <section className="related-projects project-detail-enter">
        <div className="projects-header"><div><p className="eyebrow">FEATURED PROJECTS</p><h2>Selected Work</h2><p>Projects that apply my cybersecurity CTF expertise, full-stack development, UI/UX prototyping, and community leadership to practical challenges.</p></div></div>
        <div className="projects-grid">{relatedProjects.map((item) => <article className="project-card" key={item.id}><div className="project-image">{item.imageUrl ? <Image src={item.imageUrl} alt={`${item.title} project thumbnail`} width={800} height={600} unoptimized /> : <Image src={projectPlaceholder(item)} alt={`${item.title} project placeholder`} width={800} height={600} />}</div><div className="project-content"><small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p><div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link className="project-link" href={`/projects/${item.id}`}>View Project <span>→</span></Link></div></article>)}</div>
      </section>
    </main>
  );
}
