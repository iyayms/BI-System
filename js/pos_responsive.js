/* =============================================
   pos-responsive.js
   Add as a deferred script AFTER pointsofsale.js
   ============================================= */
(function () {
  "use strict";

  const BREAKPOINT = 1024;

  function init() {

    // ── 1. Inject floating cart toggle button ──────────────────
    let toggleBtn = document.getElementById("order-toggle-btn");
    if (!toggleBtn) {
      toggleBtn = document.createElement("button");
      toggleBtn.id = "order-toggle-btn";
      toggleBtn.setAttribute("aria-label", "View order summary");
      document.body.appendChild(toggleBtn);
    }

    // ── 2. Inject overlay ──────────────────────────────────────
    let overlay = document.getElementById("order-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "order-overlay";
      document.body.appendChild(overlay);
    }

    const orderPanel = document.querySelector(".order-summary");
    if (!orderPanel) return;

    // ── 3. Badge state (keep as a variable, not innerHTML-dependent) ──
    let badgeCount = 0;

    function renderToggleBtn(isOpen) {
      if (isOpen) {
        toggleBtn.innerHTML = `<i class="ph ph-x"></i> Close`;
      } else {
        toggleBtn.innerHTML =
          `<i class="ph ph-shopping-cart-simple"></i> View Order ` +
          `<span class="cart-count" id="cartBadge">${badgeCount}</span>`;
      }
    }

    // Initial render
    renderToggleBtn(false);

    // ── 4. Open / close helpers ───────────────────────────────
    function openOrder() {
      orderPanel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      renderToggleBtn(true);
    }

    function closeOrder() {
      orderPanel.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      renderToggleBtn(false);
    }

    // Ensure closed on init
    if (window.innerWidth <= BREAKPOINT) closeOrder();

    // ── 5. Event listeners ────────────────────────────────────
    toggleBtn.addEventListener("click", () => {
      orderPanel.classList.contains("open") ? closeOrder() : openOrder();
    });

    overlay.addEventListener("click", closeOrder);

    // "Order More" closes the panel
    const orderMore = document.getElementById("orderMore");
    if (orderMore) orderMore.addEventListener("click", closeOrder);

    // Auto-close panel when checkout/receipt/thankyou modals open
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
      }
    });

    // ── 6. Cart badge — observe #cartItems for row changes ────
    const cartBody = document.getElementById("cartItems");
    if (cartBody) {
      new MutationObserver(() => {
        badgeCount = cartBody.querySelectorAll("tr").length;

        // Update badge in DOM if button is in "closed" state
        const badgeEl = document.getElementById("cartBadge");
        if (badgeEl) {
          badgeEl.textContent = badgeCount;
          // Pop animation
          badgeEl.style.animation = "none";
          void badgeEl.offsetWidth;
          badgeEl.style.animation = "badgePop 0.3s ease";
        }
      }).observe(cartBody, { childList: true, subtree: true });
    }

    // Inject badge keyframe once
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