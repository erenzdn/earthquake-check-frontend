import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

const PageTransition = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef(null);
  const progressSweepRef = useRef(null);

  // Handle smooth scroll for anchor links using GSAP ScrollToPlugin
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const targetLink = e.target.closest("a");
      if (!targetLink) return;

      const href = targetLink.getAttribute("href");
      if (!href) return;

      // Check if it's an anchor link on the current page
      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        const targetId = href.includes("#") ? href.split("#")[1] : null;
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();

          // Smooth scroll using GSAP with a premium power3.inOut ease
          gsap.to(window, {
            duration: 1.1,
            scrollTo: {
              y: targetElement,
              offsetY: 90 // Offset to account for the fixed header/navbar
            },
            ease: "power3.inOut"
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  useGSAP(() => {
    // 1. Reset scroll immediately on route change
    window.scrollTo(0, 0);

    // 2. Create a timeline for the page transitions
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // 3. Sleek progress sweep animation at the top of the viewport
    tl.fromTo(
      progressSweepRef.current,
      { width: "0%", opacity: 1 },
      { width: "100%", duration: 0.45, ease: "power2.in" }
    );

    // 4. Smooth page-container entrance (fade and subtle slide up)
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
      "-=0.15" // Slight overlap with the progress bar sweep
    );

    // Fade out progress bar smoothly once sweep is complete
    tl.to(progressSweepRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power1.in"
    });

    // 5. Staggered fade and slide-up for titles and headers
    const headings = containerRef.current.querySelectorAll(
      "h1, .page-title, .page-subtitle, .ec-badge-glass, .ec-text-gradient-cyan"
    );
    if (headings.length > 0) {
      gsap.fromTo(
        headings,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.05,
          clearProps: "transform,opacity"
        }
      );
    }

    // 6. Staggered entry for bento cards, content sections, buttons, and forms
    const items = containerRef.current.querySelectorAll(
      ".bento-card, .about-card, .tech-card, .contact-card, .how-it-works-step, .risk-form-glow-shell, .faq-header, .btn-glow-indigo, .dashboard-viewport"
    );
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.12,
          clearProps: "transform,opacity"
        }
      );
    }
  }, { dependencies: [location.pathname], scope: containerRef });

  return (
    <div className="relative w-full overflow-hidden">
      {/* Sleek Top Progress Bar Sweep */}
      <div
        ref={progressSweepRef}
        className="fixed top-0 left-0 h-1 z-50 bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none"
        style={{ width: "0%" }}
      />

      {/* Page Content Container */}
      <div ref={containerRef} className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
