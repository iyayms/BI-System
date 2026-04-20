document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    renderPurchaseTable(transactions);
});

/* =========================
SIDEBAR LOADING
========================= */
function loadSidebar() {
    fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        const container = document.getElementById("sidebar-container");
        if(container){
            container.innerHTML = data;
            const links = document.querySelectorAll(".menu a");
            links.forEach(link => {
                if(link.getAttribute("href").includes("purchasehistory.html")){
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
    { 
        no: 1, 
        id: "1234567890", 
        date: "1/11/2026", 
        qty: 3, 
        amount: 320,
        items: [
            { name: "Special Halo-halo", qty: 1, price: 150 },
            { name: "Mango Graham Shake", qty: 1, price: 80 },
            { name: "Mango Shake", qty: 1, price: 90 }
        ]
    },
    { 
        no: 2, 
        id: "1234567891", 
        date: "1/11/2026", 
        qty: 2, 
        amount: 250,
        items: [
            { name: "Saba De Leche", qty: 2, price: 125 }
        ]
    },
    { 
        no: 3, 
        id: "1234567892", 
        date: "1/11/2026", 
        qty: 5, 
        amount: 620,
        items: [
            { name: "Mais De Leche", qty: 3, price: 300 },
            { name: "Halo-halo", qty: 2, price: 320 }
        ]
    },
    { 
        no: 4, 
        id: "1234567893", 
        date: "1/11/2026", 
        qty: 2, 
        amount: 160,
        items: [
            { name: "Milo Con Yelo", qty: 2, price: 80 }
        ]
    },
    { 
        no: 5, 
        id: "1234567894", 
        date: "1/11/2026", 
        qty: 6, 
        amount: 480,
        items: [
            { name: "Mango Con Yelo", qty: 4, price: 320 },
            { name: "Oreo Cheese Shake", qty: 2, price: 160 }
        ]
    },
    { 
        no: 6, 
        id: "1234567895", 
        date: "1/11/2026", 
        qty: 4, 
        amount: 300,
        items: [
            { name: "Saba Con Yelo", qty: 4, price: 300 }
        ]
    },
    { 
        no: 7, 
        id: "1234567896", 
        date: "1/11/2026", 
        qty: 1, 
        amount: 150,
        items: [
            { name: "Special Halo-halo", qty: 1, price: 150 }
        ]
    }
];

/* =========================
RENDER TABLE (UPDATED)
========================= */
function renderPurchaseTable(data) {
    const tbody = document.getElementById("purchaseTableBody");
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.no}</td>
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.qty}</td>
            <td>${item.amount}</td>
            <td>
                <div class="view-details-link" onclick="openDetailsModal('${item.id}')" style="cursor: pointer;">
                    VIEW DETAILS <i class="ph ph-arrow-circle-right"></i>
                </div>
            </td>
        </tr>
    `).join("");
}

/* =========================
MODAL LOGIC
========================= */
function openDetailsModal(transactionId) {
    const modal = document.getElementById("detailsModal");
    const trans = transactions.find(t => t.id === transactionId);

    if (trans) {
        document.getElementById("detailTransId").value = trans.id;
        document.getElementById("detailDate").value = trans.date + " 02:43:13 PM";
        document.getElementById("detailTotal").value = `PHP ${trans.amount}`;
        
        const itemBody = document.getElementById("itemListBody");
        
        // Use the items directly from the transaction object
        itemBody.innerHTML = trans.items.map(item => `
            <div class="product-item">
                <span>${item.name}</span>
                <span>${item.qty}</span>
                <span>${item.price}</span>
            </div>
        `).join("");

        modal.classList.add("active");
        document.body.style.overflow = 'hidden';
    }
}

/* =========================
   MODAL INTERACTIVITY
   ========================= */

// Function to handle the Print Receipt button
const printBtn = document.getElementById("printReceiptBtn");
if (printBtn) {
    printBtn.onclick = function() {
        // Optional: You can create a specialized print view or just trigger the browser print
        // For a simple web project, we trigger the system print dialog
        window.print();
    };
}

// Function to handle the Close button
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
if (closeDetailsBtn) {
    closeDetailsBtn.onclick = () => {
        const modal = document.getElementById("detailsModal");
        modal.classList.remove("active");
        
        // Restore background scrolling
        document.body.style.overflow = 'auto';
    };
}

// Close modal if clicking outside the modal box (on the overlay)
const detailsModalOverlay = document.getElementById("detailsModal");
if (detailsModalOverlay) {
    detailsModalOverlay.onclick = (e) => {
        if (e.target === detailsModalOverlay) {
            detailsModalOverlay.classList.remove("active");
            document.body.style.overflow = 'auto';
        }
    };
}