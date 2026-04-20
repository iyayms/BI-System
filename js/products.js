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
    { category: "Fruits", name: "Mango", pricePerGram: 0.8, stock: 150, unit: "g" },
    { category: "Fruits", name: "Banana", pricePerGram: 0.5, stock: 200, unit: "g" },

    { category: "Dairy", name: "EvaporatedMilk", pricePerGram: 0.5, stock: 300, unit: "ml" },
    { category: "Dairy", name: "Condensed Milk", pricePerGram: 0.4, stock: 500, unit: "ml" },

    { category: "Powder", name: "Milo", pricePerGram: 0.6, stock: 200, unit: "g" },
    { category: "Powder", name: "Graham Cracker", pricePerGram: 0.55, stock: 180, unit: "g" },

    { category: "Toppings", name: "Nata de Coco", pricePerGram: 0.45, stock: 250, unit: "g" },
    { category: "Toppings", name: "Kaong", pricePerGram: 0.45, stock: 220, unit: "g" },

    { category: "Materials", name: "Plastic Cup", pricePerGram: 2.5, stock: 500, unit: "pc" },
    { category: "Materials", name: "Plastic Spoon", pricePerGram: 1.5, stock: 600, unit: "pc" },

    { category: "Ice", name: "Crushed Ice", pricePerGram: 0.1, stock: 2000, unit: "g" },

    { category: "Syrup", name: "Mango Syrup", pricePerGram: 0.7, stock: 150, unit: "ml" },
    { category: "Syrup", name: "Chocolate Syrup", pricePerGram: 0.75, stock: 140, unit: "ml" },

    { category: "Sinkers", name: "Tapioca Pearl", pricePerGram: 0.65, stock: 200, unit: "g" },
    { category: "Sinkers", name: "Crystals", pricePerGram: 0.9, stock: 120, unit: "g" }
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
                        <i class="ph ph-note-pencil" onclick="openEditModal('${item.id}')"></i>
                        <i class="ph ph-trash" onclick="deleteProduct('${item.id}')"></i>
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
   SAVE PRODUCT
========================= */

const saveProductBtn = document.getElementById("saveProductBtn");

if (saveProductBtn) {
    saveProductBtn.onclick = function () {

        const name = document.getElementById("newProductName").value;
        const category = document.getElementById("newProductCategory").value;
        const price = parseFloat(document.getElementById("newProductPrice").value);

        if (!name || category === "SELECT CATEGORY" || isNaN(price)) {
            alert("Please complete all product details.");
            return;
        }

        // Generate Product ID automatically
        const prefixMap = {
            "Special": "SP",
            "Shake": "SH",
            "Iced": "IC"
        };

        const prefix = prefixMap[category] || "PR";

        const count = products.filter(p => p.category === category).length + 1;
        const newId = `${prefix}-${String(count).padStart(3,'0')}`;

        // Calculate margin
        const margin = price > 0 ? ((price - totalMaterialCost) / price) * 100 : 0;

        const ingredientsCount = document.querySelectorAll("#ingredientBody tr").length;

        const newProduct = {
            id: newId,
            name: name,
            category: category,
            margin: margin.toFixed(1),
            price: price,
            ingredients: ingredientsCount,
            status: ingredientsCount > 0 ? "Available" : "No Ingredients"
        };

        // 🔥 Add to TOP of array
        products.unshift(newProduct);

        // Refresh table
        renderProductTable(products);

        // Close modal
        document.getElementById("addModal").classList.remove("active");

        // Reset fields
        document.getElementById("newProductName").value = "";
        document.getElementById("newProductCategory").value = "SELECT CATEGORY";
        document.getElementById("newProductPrice").value = "";
        document.getElementById("ingredientBody").innerHTML = "";

        totalMaterialCost = 0;
        updateFinancials();
    };
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

/* =========================
   EDIT PRODUCT LOGIC
   ========================= */
/* =========================
   EDIT MODAL LOGIC (FIXED)
   ========================= */

// 1. Function to open and populate the modal
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById("editProductId").value = product.id;
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductCategory").value = product.category;
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editIngredientsNeeded").value = product.ingredients;
        
        // Calculate and display material cost
        document.getElementById("editMaterialsCost").value = "PHP " + (product.price * 0.4).toFixed(2);
        
        const statusEl = document.getElementById("editStatusText");
        statusEl.textContent = product.status;
        
        // Apply Bold Green or Red based on status
        statusEl.classList.remove("status-green", "status-red");
        if (product.status.toLowerCase() === "available") {
            statusEl.classList.add("status-green");
        } else {
            statusEl.classList.add("status-red");
        }

        document.getElementById("editModal").classList.add("active");
    }
}

// 2. Logic for the "SAVE CHANGES" button
const saveEditBtn = document.getElementById("saveEditBtn");
if (saveEditBtn) {
    saveEditBtn.onclick = function() {
        const id = document.getElementById("editProductId").value;
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            // Update the local data array
            products[index].name = document.getElementById("editProductName").value;
            products[index].category = document.getElementById("editProductCategory").value;
            products[index].price = parseFloat(document.getElementById("editProductPrice").value);
            
            renderProductTable(products); // Refresh the main table
            document.getElementById("editModal").classList.remove("active");
        }
    };
}

// 3. Logic for the "CANCEL" button
const closeEditBtn = document.getElementById("closeEditModal");
if (closeEditBtn) {
    closeEditBtn.onclick = () => {
        document.getElementById("editModal").classList.remove("active");
    };
}

/* =========================
   DELETE PRODUCT LOGIC
   ========================= */

let productToDelete = null; // Temporary storage for the ID

// 1. Function called by the trash icon in the table
function deleteProduct(productId) {
    productToDelete = productId; // Store the ID
    document.getElementById("deleteModal").classList.add("active");
}

// 2. Logic for "YES, DELETE" button
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = function() {
        if (productToDelete) {
            // Find index of the item in the products array
            const index = products.findIndex(p => p.id === productToDelete);
            
            if (index !== -1) {
                // Remove from array
                products.splice(index, 1);
                
                // Refresh table and close modal
                renderProductTable(products);
                document.getElementById("deleteModal").classList.remove("active");
                productToDelete = null; // Clear selection
            }
        }
    };
}

// 3. Logic for "CANCEL" button
const closeDeleteModal = document.getElementById("closeDeleteModal");
if (closeDeleteModal) {
    closeDeleteModal.onclick = () => {
        document.getElementById("deleteModal").classList.remove("active");
        productToDelete = null;
    };
}