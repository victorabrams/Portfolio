import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ibrahim Fawwaz | Portfolio",
  description: "Portfolio dynamic of Ibrahim Fawwaz, Cyber Security Enthusiast and Full-Stack Developer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
