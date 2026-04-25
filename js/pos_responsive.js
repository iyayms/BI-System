/* =============================================
   pos-responsive.js
   Add LAST deferred script after pointsofsale.js
   ============================================= */
(function () {
  "use strict";

  const BREAKPOINT = 1024;
  let badgeCount = 0;

  function isMobile() { return window.innerWidth <= BREAKPOINT; }

  function init() {
    const orderPanel  = document.querySelector(".order-summary");
    const orderHeader = document.querySelector(".order-header");
    if (!orderPanel || !orderHeader) return;

    /* ── Inject floating toggle button ── */
    let toggleBtn = document.getElementById("order-toggle-btn");
    if (!toggleBtn) {
      toggleBtn = document.createElement("button");
      toggleBtn.id = "order-toggle-btn";
      toggleBtn.setAttribute("aria-label", "View order");
      document.body.appendChild(toggleBtn);
    }

    /* Overlay removed — no dimming */

    /* ── Inject close X into order header (top-right) ── */
    let closeBtn = document.getElementById("order-close-btn");
    if (!closeBtn) {
      closeBtn = document.createElement("button");
      closeBtn.id = "order-close-btn";
      closeBtn.setAttribute("aria-label", "Close order panel");
      closeBtn.innerHTML = '<i class="ph ph-x"></i>';
      orderHeader.appendChild(closeBtn);
    }

    /* ── Badge update ── */
    function updateBadge(count) {
      badgeCount = count;
      const el = document.getElementById("cartBadge");
      if (el) {
        el.textContent = badgeCount;
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "badgePop 0.3s ease";
      }
    }

    /* ── Render toggle button ── */
    function renderBtn() {
      toggleBtn.innerHTML =
        `<i class="ph ph-shopping-cart-simple"></i> View Order ` +
        `<span class="cart-count" id="cartBadge">${badgeCount}</span>`;
    }
    renderBtn();

    /* ── Open panel ── */
    function openOrder() {
      orderPanel.classList.add("open");

      document.body.style.overflow = "hidden";
      /* Hide floating btn — X inside header closes the panel */
      toggleBtn.style.display = "none";
    }

    /* ── Close panel ── */
    function closeOrder() {
      orderPanel.classList.remove("open");

      document.body.style.overflow = "";
      if (isMobile()) toggleBtn.style.display = "flex";
    }

    /* ── Force closed on init ── */
    closeOrder();

    /* ── Listeners ── */
    toggleBtn.addEventListener("click", openOrder);
    closeBtn.addEventListener("click", closeOrder);


    const orderMore = document.getElementById("orderMore");
    if (orderMore) orderMore.addEventListener("click", closeOrder);

    /* Auto-close when any modal opens */
    ["checkoutModal", "receiptModal", "thankYouModal"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      new MutationObserver(() => {
        if (el.style.display === "flex") closeOrder();
      }).observe(el, { attributes: true, attributeFilter: ["style"] });
    });

    /* Reset on resize to desktop */
    window.addEventListener("resize", () => {
      if (!isMobile()) {
        closeOrder();
        toggleBtn.style.display = "";
        document.body.style.overflow = "";
      }
    });

    /* ── Cart badge observer ── */
    const cartBody = document.getElementById("cartItems");
    if (cartBody) {
      new MutationObserver(() => {
        const count = cartBody.querySelectorAll("tr").length;
        updateBadge(count);
        /* Re-render btn only when it's visible (panel closed) */
        if (!orderPanel.classList.contains("open")) renderBtn();
      }).observe(cartBody, { childList: true, subtree: true });
    }

    /* Badge pop keyframe */
    if (!document.getElementById("pos-responsive-style")) {
      const style = document.createElement("style");
      style.id = "pos-responsive-style";
      style.textContent = `
        @keyframes badgePop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();