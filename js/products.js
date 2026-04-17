/* =========================
GLOBAL STATE
========================= */
let totalMaterialCost = 0;

/* =========================
SIDEBAR LOADING
========================= */

fetch("../components/sidebar.html")
.then(res => res.text())
.then(data => {

    const container = document.getElementById("sidebar-container");

    if(container){
        container.innerHTML = data;

        const links = document.querySelectorAll(".menu a");

        links.forEach(link=>{
            if(link.getAttribute("href").includes("products.html")){
                link.classList.add("active");
            }
        });
    }

})
.catch(err=>console.error("Error loading sidebar:",err));


/* =========================
INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", () => {
    renderProductTable(products);
    setupEventListeners();
    populateCategoryDropdown();
});

/* =========================
PRODUCT DATA
========================= */
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

const inventory = [
    { category: "Fruit", name: "Mango", pricePerGram: 0.8, stock: 150, unit: "g" },
    { category: "Powder", name: "Milo", pricePerGram: 0.6, stock: 200, unit: "g" },
    { category: "Sweetener", name: "Sugar", pricePerGram: 0.3, stock: 500, unit: "g" },
    { category: "Dairy", name: "Milk", pricePerGram: 0.5, stock: 300, unit: "ml" },
    { category: "Dairy", name: "Condensation Milk", pricePerGram: 0.4, stock: 500, unit: "ml" }
];

/* =========================
RENDER TABLE
========================= */
function renderProductTable(data) {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    tbody.innerHTML = data.map(item => {
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
            </tr>`;
    }).join("");
}

/* =========================
EVENT LISTENERS & MODALS
========================= */
function setupEventListeners() {
    // Main Add Product Modal
    const addModal = document.getElementById("addModal");
    const addBtn = document.querySelector(".add-btn");
    const closeModal = document.getElementById("closeModal");

    if (addBtn) addBtn.onclick = () => addModal.classList.add("active");
    if (closeModal) {
        closeModal.onclick = () => {
            addModal.classList.remove("active");
            document.getElementById("ingredientBody").innerHTML = "";
            totalMaterialCost = 0;
            updateFinancials();
        };
    }

    // Ingredient Modal
    const ingredientModal = document.getElementById("ingredientOverlay");
    const addIngBtn = document.querySelector(".add-ing-btn");
    const closeIngBtn = document.getElementById("closeIngredientModal");

    if (addIngBtn) addIngBtn.onclick = () => ingredientModal.classList.add("active");
    if (closeIngBtn) closeIngBtn.onclick = () => ingredientModal.classList.remove("active");

    // Input Listeners
    const ingName = document.getElementById("ingredientName");
    const ingGrams = document.getElementById("ingredientGrams");
    const prodPrice = document.getElementById("newProductPrice");

    if (ingName) ingName.addEventListener("input", calculateIngredientData);
    if (ingGrams) ingGrams.addEventListener("input", calculateIngredientData);
    if (prodPrice) prodPrice.addEventListener("input", updateFinancials);

    // Save Ingredient
    const saveIngBtn = document.getElementById("saveIngredient");
    if (saveIngBtn) {
        saveIngBtn.onclick = () => {
            const tbody = document.getElementById("ingredientBody");
            const name = document.getElementById("ingredientName").value;
            const amount = parseFloat(document.getElementById("ingredientGrams").value);
            const item = inventory.find(i => i.name === name);

            if (!item || isNaN(amount) || amount <= 0) {
                alert("Please select a valid ingredient and enter amount.");
                return;
            }

            const unitCost = amount * item.pricePerGram;
            totalMaterialCost += unitCost;
            updateFinancials();

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tbody.children.length + 1}</td>
                <td>${name}</td>
                <td>${amount} ${item.unit}</td>
                <td>₱${item.pricePerGram.toFixed(2)}</td>
                <td><i class="ph ph-trash delete-ing" style="color:red; cursor:pointer;"></i></td>
            `;

            row.querySelector(".delete-ing").onclick = function() {
                totalMaterialCost -= unitCost;
                row.remove();
                updateFinancials();
            };

            tbody.appendChild(row);
            ingredientModal.classList.remove("active");
            resetIngredientFields();
        };
    }
}

/* =========================
DROPDOWNS & CALCULATIONS
========================= */
function populateCategoryDropdown() {
    const catSelect = document.getElementById("ingredientCategory");
    if (!catSelect) return;

    const categories = [...new Set(inventory.map(i => i.category))];
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        catSelect.appendChild(opt);
    });

    catSelect.onchange = function() {
        const datalist = document.getElementById("ingredientList");
        datalist.innerHTML = "";
        inventory.filter(i => i.category === this.value).forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.name;
            datalist.appendChild(opt);
        });
    };
}

function calculateIngredientData() {
    const name = document.getElementById("ingredientName").value;
    const amount = parseFloat(document.getElementById("ingredientGrams").value) || 0;
    const item = inventory.find(i => i.name === name);

    if (!item) { resetIngredientFields(); return; }

    document.getElementById("pricePerGram").innerText = `₱${item.pricePerGram.toFixed(2)}`;
    document.getElementById("unitCost").innerText = `₱${(amount * item.pricePerGram).toFixed(2)}`;
    document.getElementById("remainingStock").innerText = `${item.stock} ${item.unit}`;

    const status = document.getElementById("ingredientStatus");
    if (item.stock <= 0) { status.textContent = "No Stock"; status.style.color = "red"; }
    else if (item.stock < 100) { status.textContent = "Low Stock"; status.style.color = "orange"; }
    else { status.textContent = "Available"; status.style.color = "green"; }
}

function updateFinancials() {
    const price = parseFloat(document.getElementById("newProductPrice").value) || 0;
    document.getElementById("totalMaterialCost").value = `PHP ${totalMaterialCost.toFixed(2)}`;
    document.getElementById("materialsCostDisplay").value = `PHP ${totalMaterialCost.toFixed(2)}`;

    const marginEl = document.getElementById("estimatedMargin");
    if (price > 0) {
        const margin = price - totalMaterialCost;
        const percent = (margin / price) * 100;
        marginEl.innerText = `PHP ${margin.toFixed(2)} (${percent.toFixed(1)}%)`;
    } else {
        marginEl.innerText = `PHP 0.00 (0.0%)`;
    }
}

function resetIngredientFields() {
    document.getElementById("pricePerGram").innerText = "₱0.00";
    document.getElementById("unitCost").innerText = "₱0.00";
    document.getElementById("remainingStock").innerText = "0 g/ml";
    document.getElementById("ingredientStatus").textContent = "-";
}