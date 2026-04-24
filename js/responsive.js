/* =============================================
   responsive.js — Add LAST deferred script
   ============================================= */
(function () {
  "use strict";

  const BREAKPOINT = 1024; // tablet + mobile both get the drawer

  function init() {
    // 1. Inject hamburger
    if (!document.getElementById("sidebar-toggle")) {
      const btn = document.createElement("button");
      btn.id = "sidebar-toggle";
      btn.setAttribute("aria-label", "Toggle sidebar");
      btn.innerHTML = '<i class="ph ph-list"></i>';
      document.body.appendChild(btn);
    }

    // 2. Inject overlay
    if (!document.getElementById("sidebar-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "sidebar-overlay";
      document.body.appendChild(overlay);
    }

    const toggle  = document.getElementById("sidebar-toggle");
    const overlay = document.getElementById("sidebar-overlay");
    const sidebar = document.getElementById("sidebar-container");

    if (!sidebar) {
      console.warn("responsive.js: #sidebar-container not found.");
      return;
    }

    function openSidebar() {
      sidebar.classList.add("open");
      overlay.classList.add("active");
      toggle.innerHTML = '<i class="ph ph-x"></i>';
      document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      toggle.innerHTML = '<i class="ph ph-list"></i>';
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    });

    overlay.addEventListener("click", closeSidebar);

    // Close on nav link tap
    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= BREAKPOINT) closeSidebar();
      });
    });

    // Reset when resized above breakpoint (desktop)
    window.addEventListener("resize", () => {
      if (window.innerWidth > BREAKPOINT) {
        closeSidebar();
        document.body.style.overflow = "";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();