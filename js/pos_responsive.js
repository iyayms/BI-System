/* =============================================
   pos-responsive.js
   Add LAST deferred script after pointsofsale.js
   ============================================= */
(function () {
  "use strict";

  const BREAKPOINT = 1024;
  let badgeCount = 0;
  let isOpen = false;

  function init() {
    const orderPanel = document.querySelector(".order-summary");
    const orderHeader = document.querySelector(".order-header");
    if (!orderPanel || !orderHeader) return;

    // ── 1. Inject floating "View Order" button ─────────────────
    let toggleBtn = document.getElementById("order-toggle-btn");
    if (!toggleBtn) {
      toggleBtn = document.createElement("button");
      toggleBtn.id = "order-toggle-btn";
      toggleBtn.setAttribute("aria-label", "View order summary");
      document.body.appendChild(toggleBtn);
    }

    // ── 2. Inject dark overlay ─────────────────────────────────
    let overlay = document.getElementById("order-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "order-overlay";
      document.body.appendChild(overlay);
    }

    // ── 3. Inject close "X" button INTO the order header ───────
    //    This way it's inside the panel — never overlaps footer
    let closeBtn = document.getElementById("order-close-btn");
    if (!closeBtn) {
      closeBtn = document.createElement("button");
      closeBtn.id = "order-close-btn";
      closeBtn.setAttribute("aria-label", "Close order summary");
      closeBtn.innerHTML = '<i class="ph ph-x"></i>';
      orderHeader.appendChild(closeBtn);   // appended → sits right in header row
    }

    // ── 4. Render toggle button label ─────────────────────────
    function renderBtn() {
      toggleBtn.innerHTML =
        `<i class="ph ph-shopping-cart-simple"></i> View Order ` +
        `<span class="cart-count" id="cartBadge">${badgeCount}</span>`;
    }
    renderBtn();

    // ── 5. Open / close ───────────────────────────────────────
    function openOrder() {
      isOpen = true;
      orderPanel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      // Hide toggle btn while panel is open — close btn inside header handles closing
      toggleBtn.style.display = "none";
    }

    function closeOrder() {
      isOpen = false;
      orderPanel.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      // Re-show toggle btn
      if (window.innerWidth <= BREAKPOINT) {
        toggleBtn.style.display = "flex";
      }
    }

    // Ensure closed on init for tablet/mobile
    if (window.innerWidth <= BREAKPOINT) {
      orderPanel.classList.remove("open");
      overlay.classList.remove("active");
    }

    // ── 6. Event listeners ────────────────────────────────────
    toggleBtn.addEventListener("click", openOrder);
    closeBtn.addEventListener("click", closeOrder);
    overlay.addEventListener("click", closeOrder);

    // "Order More" → close panel then keep shopping
    const orderMore = document.getElementById("orderMore");
    if (orderMore) orderMore.addEventListener("click", closeOrder);

    // Auto-close when modals open
    ["checkoutModal", "receiptModal", "thankYouModal"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      new MutationObserver(() => {
        if (el.style.display === "flex") closeOrder();
      }).observe(el, { attributes: true, attributeFilter: ["style"] });
    });

    // Reset on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > BREAKPOINT) {
        closeOrder();
        document.body.style.overflow = "";
        toggleBtn.style.display = "";   // let CSS control display on desktop
      } else if (!isOpen) {
        toggleBtn.style.display = "flex";
      }
    });

    // ── 7. Cart badge — observe #cartItems for changes ────────
    const cartBody = document.getElementById("cartItems");
    if (cartBody) {
      new MutationObserver(() => {
        badgeCount = cartBody.querySelectorAll("tr").length;
        // Update badge without rebuilding whole button
        const badgeEl = document.getElementById("cartBadge");
        if (badgeEl) {
          badgeEl.textContent = badgeCount;
          badgeEl.style.animation = "none";
          void badgeEl.offsetWidth;
          badgeEl.style.animation = "badgePop 0.3s ease";
        }
      }).observe(cartBody, { childList: true, subtree: true });
    }

    // Badge pop animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes badgePop {
        0%   { transform: scale(1); }
        50%  { transform: scale(1.5); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();