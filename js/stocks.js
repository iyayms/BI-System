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
    // Fruits
    { name: "Mango", cat: "Fruit", price: 150, soldBy: "Bundle/Kilo", ppg: 10, stock: "3 kg", min: "2 kg", status: "Low in Ingredients" },
    { name: "Saba", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", ppg: 7, stock: "2 kg", min: "1 kg", status: "Available" },
    { name: "Melon", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", ppg: 5, stock: "1 kg", min: "1 kg", status: "Available" },
    { name: "Mais", cat: "Fruit", price: 100, soldBy: "Can", ppg: 8, stock: "2 cans", min: "1 can", status: "Not Available" },
    
    // Dairy
    { name: "Milk", cat: "Dairy", price: 100, soldBy: "Can", ppg: 0.50, stock: "300ml", min: "60ml", status: "Available" },
    { name: "Condensation Milk", cat: "Dairy", price: 90, soldBy: "Can", ppg: 0.40, stock: "50ml", min: "30ml", status: "Low in Ingredients" },
    { name: "Evaporated Milk", cat: "Dairy", price: 45, soldBy: "Can", ppg: 0.35, stock: "10 cans", min: "3 cans", status: "Available" },
    
    // Powder
    { name: "Milo", cat: "Powder", price: 80, soldBy: "Pack", ppg: 0.60, stock: "200g", min: "50g", status: "Available" },
    { name: "Graham", cat: "Powder", price: 80, soldBy: "Pack", ppg: 8, stock: "2 packs", min: "1 pack", status: "No ingredients" },
    { name: "Ube Powder", cat: "Powder", price: 150, soldBy: "Pack", ppg: 12, stock: "500g", min: "100g", status: "Available" },
    
    // Toppings
    { name: "Nata", cat: "Toppings", price: 100, soldBy: "Jar", ppg: 10, stock: "2 jars", min: "1 jar", status: "Available" },
    { name: "Kaong", cat: "Toppings", price: 110, soldBy: "Jar", ppg: 9, stock: "3 jars", min: "1 jar", status: "Available" },
    { name: "Leche Flan", cat: "Toppings", price: 200, soldBy: "Tray", ppg: 20, stock: "5 trays", min: "2 trays", status: "Available" },
    
    // Materials
    { name: "Plastic Cup (16oz)", cat: "Material", price: 250, soldBy: "Roll (50pcs)", ppg: 5, stock: "150 pcs", min: "50 pcs", status: "Available" },
    { name: "Plastic Spoon", cat: "Material", price: 120, soldBy: "Pack (100pcs)", ppg: 1.2, stock: "300 pcs", min: "100 pcs", status: "Available" },
    { name: "Plastic Bag", cat: "Material", price: 80, soldBy: "Bundle", ppg: 0.8, stock: "500 pcs", min: "1/2 bundle", status: "Available" },
    { name: "Straws", cat: "Material", price: 60, soldBy: "Pack", ppg: 0.6, stock: "2 packs", min: "1/2 pack", status: "Available" }
];

/* =========================
INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", () => {
    renderStockTable(stockInventory);
    setupStockEventListeners();
    setupAddStockLogic(); // Initialize the new logic
    
    const categoryFilter = document.getElementById("stockCategoryFilter");
    const searchInput = document.getElementById("stockSearch");
    const sortFilter = document.getElementById("priceSortFilter");

    const handleFilter = () => {
        const categoryValue = categoryFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        const sortValue = sortFilter.value;

        // 1. Filter the data
        let processedData = stockInventory.filter(item => {
            const matchesCategory = categoryValue === "All Categories" || item.cat === categoryValue;
            const matchesSearch = item.name.toLowerCase().includes(searchValue);
            return matchesCategory && matchesSearch;
        });

        // 2. Sort the data
        processedData.sort((a, b) => {
            if (sortValue === "Low to High") {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });

        renderStockTable(processedData);
    };

    // Add listeners to all three controls
    if (categoryFilter) categoryFilter.addEventListener("change", handleFilter);
    if (searchInput) searchInput.addEventListener("input", handleFilter);
    if (sortFilter) sortFilter.addEventListener("change", handleFilter);
});

/* =========================
FILTER LOGIC
========================= */
function setupStockEventListeners() {
    const categoryFilter = document.getElementById("stockCategoryFilter");
    const searchBar = document.getElementById("stockSearch");

    // Filter by Category
    if (categoryFilter) {
        categoryFilter.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            filterData(selectedCategory, searchBar.value);
        });
    }

    // Filter by Search Term
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const searchTerm = e.target.value;
            filterData(categoryFilter.value, searchTerm);
        });
    }
}

function filterData(category, search) {
    const filtered = stockInventory.filter(item => {
        const matchesCategory = (category === "All Categories" || item.cat === category);
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    renderStockTable(filtered);
}

/* =========================
RENDER TABLE
========================= */
function renderStockTable(data) {
    const tbody = document.getElementById("stockTableBody");
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px;">No matching items found.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => {
        let statusClass = "status-available";
        if (item.status.includes("Low")) statusClass = "status-low";
        if (item.status.includes("Not") || item.status.includes("No")) statusClass = "status-none";

        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.cat}</td>
                <td>₱${item.price}</td>
                <td>${item.soldBy}</td>
                <td>${item.ppg}</td>
                <td>${item.stock}</td>
                <td>${item.min}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <i class="ph ph-note-pencil" onclick="openEditStockModal('${item.name}')"></i>
                        <i class="ph ph-plus-circle"></i>
                        <i class="ph ph-trash"></i>
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

/* =========================
ADD STOCK MODAL LOGIC
========================= */
function setupAddStockLogic() {
    const openAddStockModal = () => {
        const modal = document.getElementById("addStockModal");
        if (modal) {
            modal.classList.add("active");
        }
    };

    // Function to handle hiding the modal
    const closeAddStockModal = () => {
        const modal = document.getElementById("addStockModal");
        if (modal) {
            modal.classList.remove("active");
        }
    };
    const openBtn = document.querySelector(".add-btn.yellow-btn:nth-child(1)"); // Selects the first + STOCK button
    const closeBtn = document.getElementById("closeAddStock");
    const confirmBtn = document.getElementById("confirmAddStock");

    // Inputs for automation
    const categorySelect = document.getElementById("newStockCategory");
    const priceInput = document.getElementById("newStockPrice");
    const soldByInput = document.getElementById("newStockSoldBy");
    const ppgInput = document.getElementById("newStockPPG");
    const minLevelInput = document.getElementById("newStockMinLevel");

    // Open/Close
    if (openBtn) openBtn.onclick = () => addStockModal.classList.add("active");
    if (closeBtn) closeBtn.onclick = () => addStockModal.classList.remove("active");

    // Automation: Min Stock Level based on Category
    categorySelect.addEventListener("change", () => {
        const cat = categorySelect.value;
        if (cat === "Fruit") minLevelInput.value = "1 kg";
        else if (cat === "Powder") minLevelInput.value = "1 pack";
        else if (cat === "Toppings") minLevelInput.value = "1 can";
        else minLevelInput.value = "1 unit";
    });

    // Automation: Price Per Gram (Simple mock logic: Price / 100 as placeholder)
    priceInput.addEventListener("input", () => {
        const price = parseFloat(priceInput.value) || 0;
        ppgInput.value = (price / 100).toFixed(2); 
    });

    // Save Logic
    confirmBtn.onclick = () => {
        const newEntry = {
            name: document.getElementById("newStockIngredient").value,
            cat: categorySelect.value,
            price: parseFloat(priceInput.value),
            soldBy: soldByInput.value,
            ppg: ppgInput.value,
            stock: document.getElementById("newStockQty").value,
            min: minLevelInput.value,
            status: "Available"
        };

        if (newEntry.name && newEntry.cat) {
            stockInventory.push(newEntry);
            renderStockTable(stockInventory);
            addStockModal.classList.remove("active");
            // Optional: Reset form fields here
        } else {
            alert("Please fill in the required fields.");
        }
    };
}
document.querySelector(".add-btn.yellow-btn").addEventListener("click", openAddStockModal);
document.getElementById("closeAddStock").addEventListener("click", closeAddStockModal);