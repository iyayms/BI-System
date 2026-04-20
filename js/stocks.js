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
    { name: "Mango", cat: "Fruit", price: 150, soldBy: "Bundle/Kilo", gramsPerItem: 1000, ppg: 10, stock: "3 kg", min: "2 kg", status: "Low in Ingredients" },
    { name: "Saba", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", gramsPerItem: 1000, ppg: 7, stock: "2 kg", min: "1 kg", status: "Available" },
    { name: "Melon", cat: "Fruit", price: 120, soldBy: "Bundle/Kilo", gramsPerItem: 1000, ppg: 5, stock: "1 kg", min: "1 kg", status: "Available" },
    { name: "Mais", cat: "Fruit", price: 100, soldBy: "Can", gramsPerItem: 100, ppg: 8, stock: "2 cans", min: "1 can", status: "Not Available" },
    
    // Dairy
    { name: "Milk", cat: "Dairy", price: 100, soldBy: "Can", gramsPerItem: 300, ppg: 0.50, stock: "300ml", min: "60ml", status: "Available" },
    { name: "Condensed Milk", cat: "Dairy", price: 90, soldBy: "Can", gramsPerItem: 50, ppg: 0.40, stock: "50ml", min: "30ml", status: "Low in Ingredients" },
    { name: "Evaporated Milk", cat: "Dairy", price: 45, soldBy: "Can", gramsPerItem: 100, ppg: 0.35, stock: "10 cans", min: "3 cans", status: "Available" },
    
    // Powder
    { name: "Milo", cat: "Powder", price: 80, soldBy: "Pack", gramsPerItem: 200, ppg: 0.60, stock: "200g", min: "50g", status: "Available" },
    { name: "Graham", cat: "Powder", price: 80, soldBy: "Pack", gramsPerItem: 100, ppg: 8, stock: "2 packs", min: "1 pack", status: "No ingredients" },
    { name: "Ube Powder", cat: "Powder", price: 150, soldBy: "Pack", gramsPerItem: 500, ppg: 12, stock: "500g", min: "100g", status: "Available" },
    
    // Toppings
    { name: "Nata", cat: "Toppings", price: 100, soldBy: "Jar", gramsPerItem: 100, ppg: 10, stock: "2 jars", min: "1 jar", status: "Available" },
    { name: "Kaong", cat: "Toppings", price: 110, soldBy: "Jar", gramsPerItem: 100, ppg: 9, stock: "3 jars", min: "1 jar", status: "Available" },
    { name: "Leche Flan", cat: "Toppings", price: 200, soldBy: "Tray", gramsPerItem: 100, ppg: 20, stock: "5 trays", min: "2 trays", status: "Available" },
    
    // Materials
    { name: "Plastic Cup (16oz)", cat: "Material", price: 250, soldBy: "Roll (50pcs)", gramsPerItem: 150, ppg: 5, stock: "150 pcs", min: "50 pcs", status: "Available" },
    { name: "Plastic Spoon", cat: "Material", price: 120, soldBy: "Pack (100pcs)", gramsPerItem: 300, ppg: 1.2, stock: "300 pcs", min: "100 pcs", status: "Available" },
    { name: "Plastic Bag", cat: "Material", price: 80, soldBy: "Bundle", gramsPerItem: 500, ppg: 0.8, stock: "500 pcs", min: "1/2 bundle", status: "Available" },
    { name: "Straws", cat: "Material", price: 60, soldBy: "Pack", gramsPerItem: 100, ppg: 0.6, stock: "2 packs", min: "1/2 pack", status: "Available" }
];

/* =========================
INITIALIZATION
========================= */
document.addEventListener("DOMContentLoaded", () => {
    renderStockTable(stockInventory);
    populateIngredientDropdown();
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
        // Updated colspan to 10 to account for the new column
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px;">No matching items found.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => {
        // 1. Calculate Price Per Gram safely
        // If gramsPerItem is missing or 0, we show 0.00 to prevent errors
        const grams = parseFloat(item.gramsPerItem) || 0;
        const price = parseFloat(item.price) || 0;
        const pricePerGram = grams > 0 ? (price / grams).toFixed(2) : "0.00";

        // 2. Determine Status Class
        let statusClass = "status-available";
        if (item.status.includes("Low")) statusClass = "status-low";
        if (item.status.includes("Not") || item.status.includes("No")) statusClass = "status-none";

        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.cat}</td>
                <td>₱${price}</td>
                <td>${item.soldBy}</td>
                <td>${grams}g</td> <td>₱${pricePerGram}</td> <td>${item.stock}</td>
                <td>${item.min}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <i class="ph ph-note-pencil" onclick="openEditStockModal('${item.name}')"></i>
                        <i class="ph ph-plus-circle"></i>
                        <i class="ph ph-trash" onclick="deleteStock('${item.name}')"></i>
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
    const addStockModal = document.getElementById("addStockModal");
    
    // Updated selector: Find the yellow button that says "+ STOCK"
    // Usually, this is the first button in your action group
    const stockBtn = document.querySelector(".yellow-btn") || document.querySelector(".action-button-group .yellow-btn:nth-child(1)"); 
    const closeBtn = document.getElementById("closeAddStock");

    if (stockBtn) {
        stockBtn.onclick = (e) => {
            e.preventDefault(); // Prevent any default page jumps
            addStockModal.classList.add("active");
            populateIngredientDropdown(); // Refresh the list
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            addStockModal.classList.remove("active");
            clearForm();
        };
    }
}

// 1. Populate the Select Dropdown when the page loads
function populateIngredientDropdown() {
    const select = document.getElementById("ingredientSelect");
    if (!select) return;

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select Ingredient</option>';

    stockInventory.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// 2. Auto-fill data based on selected ingredient
function autoFillIngredientData() {
    const selectedName = document.getElementById("ingredientSelect").value;
    const item = stockInventory.find(i => i.name === selectedName);

    if (item) {
        document.getElementById("newStockCategory").value = item.cat || "";
        document.getElementById("autoSoldBy").value = item.soldBy || "";
        document.getElementById("autoMinStock").value = item.min || "";
        // If you already have grams stored, fill it; otherwise keep empty for new input
        document.getElementById("inputGrams").value = item.gramsPerItem || "";
        calculatePPG();
    }
}

// 3. Calculate Price Per Gram automatically
function calculatePPG() {
    const price = parseFloat(document.getElementById("inputPrice").value) || 0;
    const grams = parseFloat(document.getElementById("inputGrams").value) || 0;
    const ppgField = document.getElementById("autoPPG");

    if (price > 0 && grams > 0) {
        ppgField.value = (price / grams).toFixed(2);
    } else {
        ppgField.value = "0.00";
    }
}

// 4. Save Update and Refresh Table
function saveStockUpdate() {
    const name = document.getElementById("ingredientSelect").value;
    const cat = document.getElementById("newStockCategory").value;
    const price = parseFloat(document.getElementById("inputPrice").value) || 0;
    const grams = parseFloat(document.getElementById("inputGrams").value) || 0;
    
    // NEW: Get the quantity the user just typed in the "STOCK" input field
    const addedStockInput = document.getElementById("newStockQty").value;
    const addedAmount = parseFloat(addedStockInput) || 0;

    if (!name || !cat || addedAmount <= 0) {
        alert("Please select an ingredient and enter a valid stock amount.");
        return;
    }

    const index = stockInventory.findIndex(i => i.name === name);

    if (index !== -1) {
        // 1. Get the current stock (e.g., "3 kg" -> 3)
        const currentStockValue = parseFloat(stockInventory[index].stock) || 0;

        // 2. Add the new amount to the current amount
        const newTotalStock = currentStockValue + addedAmount;

        // 3. Keep the original unit (kg, cans, ml)
        // This regex extracts the unit part (the text after the number)
        const unit = stockInventory[index].stock.replace(/[0-9.]/g, '').trim();
        
        // 4. Update the inventory object
        stockInventory[index].cat = cat;
        stockInventory[index].price = price;
        stockInventory[index].gramsPerItem = grams;
        stockInventory[index].stock = `${newTotalStock} ${unit}`;
        
        // 5. Re-evaluate Status (Auto-Available)
        const minVal = parseFloat(stockInventory[index].min) || 0;
        stockInventory[index].status = newTotalStock > minVal ? "Available" : "Low in Ingredients";

        // 6. Refresh the UI
        renderStockTable(stockInventory);
        
        // 7. Close and Reset
        document.getElementById("addStockModal").classList.remove("active");
        clearForm();
        
        alert(`Successfully added ${addedAmount}${unit} to ${name}!`);
    }
}

function clearForm() {
    document.getElementById("ingredientSelect").value = "";
    document.getElementById("newStockCategory").value = "";
    document.getElementById("inputPrice").value = "";
    document.getElementById("inputGrams").value = "";
    document.getElementById("autoSoldBy").value = "";
    document.getElementById("autoPPG").value = "";
    document.getElementById("autoMinStock").value = "";
}

// Ensure dropdown is populated on load
window.addEventListener('DOMContentLoaded', populateIngredientDropdown);