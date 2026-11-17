"use client";

import { useEffect } from "react";

export default function MotionController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    elements.forEach((element) => observer.observe(element));

    const navigation = document.querySelector<HTMLElement>(".nav");
    const updateNavigation = () => navigation?.classList.toggle("nav-scrolled", window.scrollY > 16);
    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateNavigation); };
  }, []);

  return null;
}
