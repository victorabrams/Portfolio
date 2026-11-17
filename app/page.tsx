import Image from "next/image";
import { getPortfolio } from "@/lib/db";
import { projectPlaceholder } from "@/lib/project-placeholder";
import { sendMessage } from "./actions";
import MotionController from "@/components/motion-controller";

export const dynamic = "force-dynamic";

function SkillIcon({ category, icon }: { category: string; icon: string }) {
  if (category === "Cyber Security") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
  return icon;
}

function freshImageUrl(url: string, version: number) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${version}`;
}

function displayImageUrl(url: string, version?: number) {
  const source = version ? freshImageUrl(url, version) : url;
  try {
    return new URL(source).hostname === "lh3.googleusercontent.com" ? `/media?url=${encodeURIComponent(source)}` : source;
  } catch {
    return source;
  }
}

export default function Home() {
  const { projects, skills, certificates, testimonials, cv, profileImage } = getPortfolio();
  const skillIcons: Record<string, string> = { "Software Development": "</>", "Cyber Security": "◈", "Design & Prototyping": "◇", "Leadership & Core": "♙" };
  const skillCategories = Array.from(
    skills.reduce((categories, skill) => {
      const items = categories.get(skill.category) ?? [];
      items.push(skill);
      categories.set(skill.category, items);
      return categories;
    }, new Map<string, typeof skills>()),
  ).map(([title, items]) => ({ icon: skillIcons[title] ?? "✦", title, items }));
  const realTestimonials = testimonials.filter((testimonial) => !testimonial.isDemo);

  return (
    <main>
      <MotionController />
      <header className="nav">
        <a href="#home" className="brand"><b>IF</b><span>Ibrahim Fawwaz</span></a>
        <nav><a href="#home">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#achievements">Achievements</a><a href="#certifications">Certifications</a><a href="#testimonials">Collaboration Note</a><a href="#contact">Contact</a></nav>
        <a className="button primary nav-cta" href="#contact">Hire Me</a>
      </header>

      <section id="home" className="hero section reveal">
        <div>
          <div className="availability"><i />Available for projects</div><h1>Ibrahim Fawwaz</h1><h2>Cyber Security Enthusiast &amp; Full-Stack Developer</h2>
          <p className="lead">I build secure, functional web applications and analyze complex software vulnerabilities through competitive CTF challenges and community leadership.</p>
          <div className="actions"><a className="button primary" href="#projects">View Projects →</a>{cv ? <a className="button secondary" href={cv} target="_blank" rel="noreferrer">Download CV</a> : <a className="button secondary" href="#contact">Hire Me</a>}</div>
          <div className="hero-tags">{["Full-Stack", "CTF Player", "Binary Exploitation", "Reverse Engineering", "Cryptography", "Open-Source Intelligence (OSINT)"].map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="hero-art orbital-logo" aria-label={profileImage ? "Foto profil Ibrahim Fawwaz" : "Logo pengembang abstrak"}>{profileImage ? <Image className="profile-photo" src={displayImageUrl(profileImage)} alt="Ibrahim Fawwaz" width={560} height={560} unoptimized priority /> : <><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="logo-glow" /><span className="logo-dot red-dot" /><span className="logo-dot white-dot" /><div className="code-mark">&lt;/&gt;</div></>}</div>
      </section>

      <section id="about" className="section split reveal"><div><p className="eyebrow">ABOUT ME</p><h2>Building secure software and leading technical communities.</h2><p className="lead">I am Ibrahim Fawwaz, a Software Engineering student at Telkom Vocational High School Makassar, Community Leader at CSC STELK, and an active Cyber Security CTF player. Known in the cybersecurity community as Victor Abrams, I specialize in Reverse Engineering, Binary Exploitation (Pwn), Cryptography, and Open-Source Intelligence (OSINT).</p><p className="about-description">Beyond competing in national and regional CTF challenges, I foster a collaborative learning environment by organizing technical workshops, mentoring new members, and developing hands-on training materials.</p></div><div className="about-cards">{[["CTF Player / Cyber Security Enthusiast", "Competing in and studying Reverse Engineering, Binary Exploitation (Pwn), Cryptography, and Open-Source Intelligence (OSINT) through CTF challenges."], ["Full-Stack Developer", "Building end-to-end web applications with modern frameworks and clean architecture."], ["UI/UX Design", "Creating user-focused interfaces through research, wireframing, interactive prototyping, and responsive design."], ["Community Leader", "Organizing technical workshops, mentoring members, and leading CSC STELK initiatives."]].map(([title, description]) => <article className="card" key={title}><b>✓</b><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="skills" className="skills-section reveal"><div className="skills-inner"><div className="skills-header"><p className="eyebrow">SKILLS</p><h2>Tools and Capabilities</h2><p>A technical skill set spanning software development, cybersecurity CTF domains, UI prototyping, and community leadership.</p></div><div className="skills-grid">{skillCategories.map((category) => <article className="skill-card" key={category.title}><div className="skill-icon"><SkillIcon category={category.title} icon={category.icon} /></div><h3>{category.title}</h3><ul>{category.items.map((skill) => <li key={skill.id}><span>{skill.name}</span><b>{skill.level}</b></li>)}</ul></article>)}</div></div></section>

      <section id="projects" className="section reveal"><div className="projects-header"><div><p className="eyebrow">FEATURED PROJECTS</p><h2>Selected Work</h2><p>Projects that apply my cybersecurity CTF expertise, full-stack development, UI/UX prototyping, and community leadership to practical challenges.</p></div><a className="button secondary" href="./projects">View All Projects</a></div><div className="projects-grid">{projects.map((project) => <article className="project-card" key={project.id}><div className="project-image">{project.imageUrl ? <Image src={project.imageUrl} alt={`${project.title} project thumbnail`} width={800} height={600} unoptimized /> : <Image src={projectPlaceholder(project)} alt={`${project.title} project placeholder`} width={800} height={600} />}</div><div className="project-content"><small>{project.category}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="project-link" href={`/projects/${project.id}`}>View Project <span>→</span></a></div></article>)}</div></section>

      <section id="achievements" className="section achievements-section reveal"><div className="achievements-header"><p className="eyebrow">ACHIEVEMENTS</p><h2>Highlights</h2><p>Moments that reflect technical growth, strategy, and community leadership.</p></div><div className="achievements-grid">{[["◉", "CTF Player", "Competed in national and international CTF competitions, including LKSN Cyber Security 2026 (8th National Rank, Medallion of Excellence), SRIFOTON CTF 2025, and various international CTF challenges."], ["♞", "Full-Stack Projects", "Developing SIREX, a full-stack web application for PT Surveyor Indonesia, designed to streamline equipment inspection reporting, data management, and document generation."], ["♙", "Technical Certifications", "Certified in Full-Stack Web Development through DBS Foundation Coding Camp 2026 and Cyber Security Officer training through Telkom DigiUp 2025, covering web development, security assessment, and vulnerability mitigation."], ["♜", "Community Leadership", "Led Cyber Security Community (CSC) STELK during the 2025/2026 term, managing extracurricular activities, organizing technical workshops, and facilitating members' participation in cybersecurity seminars, including the IDSecConf 2025 Cybersecurity Operations for High School Students workshop."]].map(([icon, title, description]) => <article className="achievement-card" key={title}><div>{icon}</div><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="certifications" className="certifications-section reveal"><div className="certifications-inner"><div className="certifications-header"><p className="eyebrow">CERTIFICATIONS</p><h2>Documented Learnings</h2></div><div className="certifications-grid">{certificates.map((certificate) => <article className="certification-card" key={certificate.id}>{certificate.imageUrl ? <Image className="certificate-image" src={displayImageUrl(certificate.imageUrl, certificate.id)} alt={`Certificate ${certificate.title}`} width={800} height={500} unoptimized /> : <div className="seal">✦</div>}<small>{certificate.year}</small><h3>{certificate.title}</h3><p>{certificate.issuer}</p>{certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">View Credential →</a>}</article>)}</div></div></section>

      <section id="testimonials" className="section testimonials-section reveal"><div className="testimonials-header"><p className="eyebrow">TESTIMONI</p><h2>Collaboration Note</h2></div>{realTestimonials.length ? <div className="testimonials-grid">{realTestimonials.map((testimonial) => <figure className="card testimonial-card" key={testimonial.id}><blockquote>“{testimonial.quote}”</blockquote><figcaption>{testimonial.name}<span> · {testimonial.role}</span></figcaption></figure>)}</div> : <p className="lead testimonial-empty">Testimoni dari klien, guru, atau rekan kolaborasi akan ditampilkan di sini.</p>}</section>
      <section id="contact" className="section contact reveal"><div><p className="eyebrow">CONTACT</p><h2>Let&apos;s build something impactful.</h2><p className="lead">Have a software project, security inquiry, or community initiative? Send a message and let&apos;s talk.</p><div className="contact-links"><a href="mailto:ifawwaz100@gmail.com"><b>✉</b><span><small>Email</small>ifawwaz100@gmail.com</span></a><a href="https://linkedin.com/in/ibrahim-fawwaz/" target="_blank" rel="noreferrer"><b>in</b><span><small>LinkedIn</small>linkedin.com/in/ibrahim-fawwaz/</span></a><a href="https://instagram.com/ibrawwz_" target="_blank" rel="noreferrer"><b>◎</b><span><small>Instagram</small>@ibrawwz_</span></a></div></div><form action={sendMessage} className="card"><label>Name<input name="name" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@example.com" required /></label><label>Message<textarea name="message" rows={5} placeholder="Tell me about your project..." required /></label><button className="button primary" type="submit">Send Message</button></form></section>
      <footer><span>Designed &amp; Developed by Ibrahim Fawwaz</span><span>© {new Date().getFullYear()} Ibrahim Fawwaz</span><a className="footer-admin" href="/admin/login">Admin</a></footer>
    </main>
  );
}
