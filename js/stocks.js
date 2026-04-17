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
            if(link.getAttribute("href").includes("stocks.html")){
                link.classList.add("active");
            }
        });
    }
})
.catch(err=>console.error("Error loading sidebar:", err));

/* =========================
STOCK DATA
========================= */
const stockInventory = [
    // Unified all items to use: cat, price, ppg, stock, min, and status
    { name: "Mango", cat: "Fruit", price: 150, soldBy: "Bundle/Kilo", ppg: 10, stock: "150g", min: "20g", status: "Low in Ingredients" },
    { name: "Milo", cat: "Powder", price: 80, soldBy: "Pack", ppg: 0.60, stock: "200g", min: "50g", status: "Available" },
    { name: "Sugar", cat: "Sweetener", price: 50, soldBy: "Pack", ppg: 0.30, stock: "500g", min: "100g", status: "Available" },
    { name: "Milk", cat: "Dairy", price: 100, soldBy: "Can", ppg: 0.50, stock: "300ml", min: "60ml", status: "Available" },
    { name: "Condensed Milk", cat: "Dairy", price: 90, soldBy: "Can", ppg: 0.40, stock: "50ml", min: "30ml", status: "Low in Ingredients" },
    { name: "Saba", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", ppg: 7, stock: "2", min: "1 piling", status: "Available" },
    { name: "Mais", cat: "Fruit", price: 100, soldBy: "Can", ppg: 8, stock: "2", min: "1 kg", status: "Not Available" },
    { name: "Graham", cat: "Powder", price: 80, soldBy: "Pack", ppg: 8, stock: "2", min: "1 pack", status: "No ingredients" },
    { name: "Nata", cat: "Toppings", price: 100, soldBy: "Can", ppg: 10, stock: "2", min: "1 garapon", status: "Available" },
    { name: "Melon", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", ppg: 5, stock: "1 kg", min: "1 kg", status: "Available" }
];

/* =========================
INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", () => {
    renderStockTable(); 
    setupStockEventListeners();
});

/* =========================
RENDER TABLE
========================= */
function renderStockTable() {
    const tbody = document.getElementById("stockTableBody");
    if (!tbody) return;

    // This loop now safely accesses the unified keys defined above
    tbody.innerHTML = stockInventory.map(item => {
        // Determine status class based on the 'status' text
        let statusClass = "status-available";
        if (item.status && item.status.includes("Low")) statusClass = "status-low";
        if (item.status && (item.status.includes("Not") || item.status.includes("No"))) statusClass = "status-none";

        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.cat || "N/A"}</td>
                <td>₱${item.price || 0}</td>
                <td>${item.soldBy || "Unit"}</td>
                <td>${item.ppg || 0}</td>
                <td>${item.stock || 0}</td>
                <td>${item.min || 0}</td>
                <td><span class="${statusClass}">${item.status || "Unknown"}</span></td>
                <td>
                    <div class="action-btns">
                        <i class="ph ph-note-pencil" onclick="openEditStockModal('${item.name}')"></i>
                        <i class="ph ph-plus-circle"></i>
                        <i class="ph ph-trash" style="color:red; cursor:pointer;"></i>
                    </div>
                </td>
            </tr>`;
    }).join("");
}

/* =========================
MODAL LOGIC
========================= */
function setupStockEventListeners() {
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

function openEditStockModal(itemName) {
    const item = stockInventory.find(s => s.name === itemName);
    if (item) {
        // Assuming your edit modal has these IDs
        const modal = document.getElementById("editStockModal");
        if(modal) {
            document.getElementById("editStockName").value = item.name;
            modal.classList.add("active");
        }
    }
}