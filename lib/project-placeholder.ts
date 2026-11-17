import type { Project } from "@/lib/db";

const placeholders: Record<string, string> = {
  "Cyber Security": "/images/projects/csc-stelk.png",
  "Web Development": "/images/projects/full-stack.png",
  "UI/UX Design": "/images/projects/figma-ui-ux.png",
};

export function projectPlaceholder(project: Pick<Project, "category">) {
  return placeholders[project.category] ?? "/images/projects/placeholder.svg";
}
