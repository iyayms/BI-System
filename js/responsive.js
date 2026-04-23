/* =============================================
   responsive.js — Add as a deferred script
   after layout.js and dashboard.js in <head>
   ============================================= */

(function () {
  "use strict";

  function initResponsiveSidebar() {
    // ── 1. Inject hamburger button ──────────────────────────────
    if (!document.getElementById("sidebar-toggle")) {
      const btn = document.createElement("button");
      btn.id = "sidebar-toggle";
      btn.setAttribute("aria-label", "Toggle sidebar");
      btn.innerHTML = '<i class="ph ph-list"></i>';
      document.body.appendChild(btn);
    }

    // ── 2. Inject overlay ───────────────────────────────────────
    if (!document.getElementById("sidebar-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    const toggle   = document.getElementById("sidebar-toggle");
    const overlay  = document.getElementById("sidebar-overlay");
    const sidebar  = document.getElementById("sidebar-container");

    function openSidebar() {
      sidebar.classList.add("open");
      overlay.classList.add("active");
      toggle.innerHTML = '<i class="ph ph-x"></i>';
      document.body.style.overflow = "hidden"; // prevent background scroll
    }

    function closeSidebar() {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      toggle.innerHTML = '<i class="ph ph-list"></i>';
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);

    // Close sidebar when a nav link is tapped (mobile UX)
    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });

    // On resize to desktop: reset sidebar state
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeSidebar();
        document.body.style.overflow = "";
      }
    });
  }

  // ── 3. Responsive Chart resize helper ──────────────────────────
  // Chart.js already handles resize via responsive:true, but
  // sidebar toggle changes container width — trigger a resize event.
  function triggerChartResize() {
    setTimeout(() => window.dispatchEvent(new Event("resize")), 320);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initResponsiveSidebar();

    // Patch toggle to also resize charts
    const toggle = document.getElementById("sidebar-toggle");
    if (toggle) toggle.addEventListener("click", triggerChartResize);
  });
})();
