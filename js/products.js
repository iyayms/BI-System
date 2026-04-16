// Sidebar Loading Logic (Restore from your original setup)
fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        const container = document.getElementById("sidebar-container");
        if (container) {
            container.innerHTML = data;
            const links = document.querySelectorAll(".menu a");
            links.forEach(link => {
                if (link.getAttribute("href").includes("products.html")) {
                    link.classList.add("active");
                }
            });
        }
    })
    .catch(err => console.error("Error loading sidebar:", err));

// Your full Product Data
const products = [
    { id: "SP-001", name: "Special Halo-halo", category: "Special", margin: 40, price: 100, ingredients: 10, status: "Available" },
    { id: "SP-002", name: "Saba De Leche", category: "Special", margin: 40, price: 100, ingredients: 7, status: "Available" },
    { id: "SP-003", name: "Mais De Leche", category: "Special", margin: 40, price: 100, ingredients: 8, status: "Not Available" },
    { id: "SH-001", name: "Mango Graham Shake", category: "Shake", margin: 30, price: 100, ingredients: 8, status: "Available" },
    { id: "SH-002", name: "Mango Shake", category: "Shake", margin: 25, price: 80, ingredients: 5, status: "Available" },
    { id: "SH-003", name: "Melon Shake", category: "Shake", margin: 25, price: 80, ingredients: 5, status: "No Ingredients" },
    { id: "SH-004", name: "Oreo Cheese Shake", category: "Shake", margin: 25, price: 80, ingredients: 6, status: "Available" },
    { id: "IC-001", name: "Halo-halo", category: "Iced", margin: 20, price: 80, ingredients: 10, status: "Available" },
    { id: "IC-002", name: "Mango Con Yelo", category: "Iced", margin: 15, price: 50, ingredients: 4, status: "Available" },
    { id: "IC-003", name: "Mais Con Yelo", category: "Iced", margin: 15, price: 50, ingredients: 4, status: "Available" },
    { id: "IC-004", name: "Saba Con Yelo", category: "Iced", margin: 15, price: 50, ingredients: 4, status: "Available" },
    { id: "IC-005", name: "Milo Con Yelo", category: "Iced", margin: 15, price: 50, ingredients: 4, status: "Available" }
];

function renderProductTable(data) {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => {
        // Formats status for CSS (e.g., "Not Available" -> "status-not_available")
        const statusClass = item.status.toLowerCase().replace(/\s+/g, '_');
        
        return `
            <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td>${item.margin}%</td>
                <td>₱${item.price}</td>
                <td>${item.ingredients}</td>
                <td><span class="status-text status-${statusClass}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <i class="ph ph-note-pencil"></i>
                        <i class="ph ph-trash"></i>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal Interactivity
const addModal = document.getElementById('addModal');
const addBtn = document.querySelector('.add-btn');
const closeModal = document.getElementById('closeModal');

if (addBtn) {
    addBtn.onclick = () => addModal.classList.add('active');
}

if (closeModal) {
    closeModal.onclick = () => {
        addModal.classList.remove('active');
        document.getElementById('ingredientBody').innerHTML = ''; // Reset ingredients
    };
}

// Add Ingredient Row Function
function addIngredientRow() {
    const tbody = document.getElementById('ingredientBody');
    if (!tbody) return;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${tbody.children.length + 1}</td>
        <td><input type="text" placeholder="NAME" class="ing-input"></td>
        <td><input type="number" placeholder="0" class="ing-input"></td>
        <td><input type="number" placeholder="0.00" class="ing-input"></td>
        <td><i class="ph ph-trash" onclick="this.closest('tr').remove()" style="cursor:pointer"></i></td>
    `;
    tbody.appendChild(row);
}

const addIngBtn = document.querySelector('.add-ing-btn');
if (addIngBtn) addIngBtn.onclick = addIngredientRow;

document.addEventListener('change', (e) => {
    // 1. Category Filter logic
    if (e.target && e.target.id === 'categoryFilter') {
        const selected = e.target.value;
        if (selected === "All Categories") {
            renderProductTable(products);
        } else {
            const filtered = products.filter(p => p.category === selected);
            renderProductTable(filtered);
        }
    }

    if (e.target && e.target.id === 'priceFilter') {
        const order = e.target.value;
        let sorted = [...products];

        if (order === "Low to High") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (order === "High to Low") {
            sorted.sort((a, b) => b.price - a.price);
        }
        renderProductTable(sorted);
    }
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    renderProductTable(products);
});