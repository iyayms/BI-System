document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    initPage();
});

/* =========================
   SIDEBAR LOADING
   ========================= */
function loadSidebar() {
    fetch("../components/sidebar.html")
        .then(res => res.text())
        .then(data => {
            const container = document.getElementById("sidebar-container");
            if (container) {
                container.innerHTML = data;
                const links = document.querySelectorAll(".menu a");
                links.forEach(link => {
                    if (link.getAttribute("href").includes("purchasehistory.html")) {
                        link.classList.add("active");
                    }
                });
            }
        })
        .catch(err => console.error("Error loading sidebar:", err));
}

/* =========================
   TRANSACTION DATA
   ========================= */
const transactions = [
    { no: 1,  id: "1234567890", date: "1/11/2026", qty: 3,  amount: 320, items: [{ name: "Special Halo-halo", qty: 1, price: 150 }, { name: "Mango Graham Shake", qty: 1, price: 80 }, { name: "Mango Shake", qty: 1, price: 90 }] },
    { no: 2,  id: "1234567891", date: "1/11/2026", qty: 2,  amount: 250, items: [{ name: "Saba De Leche", qty: 2, price: 125 }] },
    { no: 3,  id: "1234567892", date: "1/11/2026", qty: 5,  amount: 620, items: [{ name: "Mais De Leche", qty: 3, price: 300 }, { name: "Halo-halo", qty: 2, price: 320 }] },
    { no: 4,  id: "1234567893", date: "1/11/2026", qty: 2,  amount: 160, items: [{ name: "Milo Con Yelo", qty: 2, price: 80 }] },
    { no: 5,  id: "1234567894", date: "1/11/2026", qty: 6,  amount: 480, items: [{ name: "Mango Con Yelo", qty: 4, price: 320 }, { name: "Oreo Cheese Shake", qty: 2, price: 160 }] },
    { no: 6,  id: "1234567895", date: "1/11/2026", qty: 4,  amount: 300, items: [{ name: "Saba Con Yelo", qty: 4, price: 300 }] },
    { no: 7,  id: "1234567896", date: "1/11/2026", qty: 1,  amount: 150, items: [{ name: "Special Halo-halo", qty: 1, price: 150 }] },
    { no: 8,  id: "1234567897", date: "1/12/2026", qty: 3,  amount: 270, items: [{ name: "Mango Graham Shake", qty: 2, price: 160 }, { name: "Halo-halo", qty: 1, price: 110 }] },
    { no: 9,  id: "1234567898", date: "1/12/2026", qty: 2,  amount: 180, items: [{ name: "Mais Con Yelo", qty: 2, price: 180 }] },
    { no: 10, id: "1234567899", date: "1/12/2026", qty: 4,  amount: 440, items: [{ name: "Special Halo-halo", qty: 2, price: 300 }, { name: "Saba De Leche", qty: 2, price: 140 }] },
    { no: 11, id: "1234567900", date: "1/13/2026", qty: 5,  amount: 550, items: [{ name: "Oreo Cheese Shake", qty: 3, price: 240 }, { name: "Mango Con Yelo", qty: 2, price: 310 }] },
    { no: 12, id: "1234567901", date: "1/13/2026", qty: 1,  amount: 80,  items: [{ name: "Milo Con Yelo", qty: 1, price: 80 }] },
];

/* =========================
   PAGINATION STATE
   ========================= */
const ROWS_PER_PAGE = 10;
const MAX_PAGES_SHOWN = 10;

let currentPage = 1;
let filteredData = [...transactions];

/* =========================
   INIT
   ========================= */
function initPage() {
    filteredData = [...transactions];
    currentPage = 1;
    renderTable();

    // Date filter
    document.getElementById("dateFilter").addEventListener("change", applyFilters);

    // Search filter
    document.getElementById("purchaseSearch").addEventListener("input", applyFilters);

    // Modal buttons
    document.getElementById("printReceiptBtn").onclick = () => window.print();
    document.getElementById("closeDetailsBtn").onclick = closeModal;
    document.getElementById("detailsModal").onclick = (e) => {
        if (e.target === document.getElementById("detailsModal")) closeModal();
    };

    // Export button
    document.querySelector(".export-btn").onclick = exportData;
}

/* =========================
   FILTER LOGIC
   ========================= */
function applyFilters() {
    const searchVal = document.getElementById("purchaseSearch").value.trim().toLowerCase();

    filteredData = transactions.filter(trans => {
        // Search: match transaction ID or any product name
        if (searchVal) {
            const matchId = trans.id.toLowerCase().includes(searchVal);
            const matchItem = trans.items.some(i => i.name.toLowerCase().includes(searchVal));
            if (!matchId && !matchItem) return false;
        }
        return true;
    });

    currentPage = 1;
    renderTable();
}

/* =========================
   RENDER TABLE
   ========================= */
function renderTable() {
    const tbody = document.getElementById("purchaseTableBody");
    if (!tbody) return;

    const totalEntries = filteredData.length;
    const totalPages = Math.min(Math.ceil(totalEntries / ROWS_PER_PAGE), MAX_PAGES_SHOWN);

    // Clamp currentPage
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No transactions found.</td></tr>`;
    } else {
        tbody.innerHTML = pageData.map(item => `
            <tr>
                <td>${item.no}</td>
                <td>${item.id}</td>
                <td>${item.date}</td>
                <td>${item.qty}</td>
                <td>PHP ${item.amount}</td>
                <td>
                    <div class="view-details-link" onclick="openDetailsModal('${item.id}')">
                        VIEW DETAILS <i class="ph ph-arrow-circle-right"></i>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    // Update pagination info
    const showStart = totalEntries === 0 ? 0 : start + 1;
    const showEnd = Math.min(end, totalEntries);
    document.getElementById("paginationInfo").textContent =
        `Showing ${showStart}–${showEnd} of ${totalEntries} entries`;

    renderPagination(totalPages);
}

/* =========================
   RENDER PAGINATION
   ========================= */
function renderPagination(totalPages) {
    const controls = document.getElementById("paginationControls");
    if (!controls) return;

    if (totalPages <= 1) {
        controls.innerHTML = "";
        return;
    }

    let html = "";

    // Previous button
    html += `<button class="page-btn nav-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>&#8249;</button>`;

    // Page number buttons (smart ellipsis)
    const pages = getPageRange(currentPage, totalPages);
    pages.forEach(p => {
        if (p === "...") {
            html += `<span class="page-ellipsis">…</span>`;
        } else {
            html += `<button class="page-btn ${p === currentPage ? "active" : ""}" onclick="goToPage(${p})">${p}</button>`;
        }
    });

    // Next button
    html += `<button class="page-btn nav-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>&#8250;</button>`;

    controls.innerHTML = html;
}

/* Smart page range with ellipsis */
function getPageRange(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
}

function goToPage(page) {
    const totalPages = Math.min(Math.ceil(filteredData.length / ROWS_PER_PAGE), MAX_PAGES_SHOWN);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

/* =========================
   MODAL LOGIC
   ========================= */
function openDetailsModal(transactionId) {
    const modal = document.getElementById("detailsModal");
    const trans = transactions.find(t => t.id === transactionId);
    if (!trans) return;

    document.getElementById("detailTransId").value = trans.id;
    document.getElementById("detailDate").value = trans.date + " 02:43:13 PM";
    document.getElementById("detailTotal").value = `PHP ${trans.amount}`;

    document.getElementById("itemListBody").innerHTML = trans.items.map(item => `
        <div class="product-item">
            <span>${item.name}</span>
            <span>${item.qty}</span>
            <span>${item.price}</span>
        </div>
    `).join("");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("detailsModal").classList.remove("active");
    document.body.style.overflow = "auto";
}

/* =========================
   EXPORT DATA
   ========================= */
function exportData() {
    try {
        const frequency = document.getElementById("dateFilter").value;
        let csvContent = "Transaction ID,Date,Quantity,Total Amount,Products\n";
        filteredData.forEach(trans => {
            const productNames = trans.items.map(i => i.name).join(" | ");
            csvContent += `${trans.id},${trans.date},${trans.qty},${trans.amount},"${productNames}"\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Meryenda_Report_${frequency.replace(/\s+/g, "_")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`Exported ${frequency} history successfully!`, "success");
    } catch (error) {
        showToast("Failed to export data. Please try again.", "error");
        console.error("Export Error:", error);
    }
}

/* =========================
   TOAST
   ========================= */
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "ph-check-circle" : "ph-x-circle";
    toast.innerHTML = `<i class="ph ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}