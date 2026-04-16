// Sidebar Loading Logic
fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
        
        // Highlight active link
        const links = document.querySelectorAll(".menu a");
        links.forEach(link => {
            if (link.getAttribute("href").includes("products.html")) {
                link.classList.add("active");
            }
        });
    })
    .catch(err => console.error("Error loading sidebar:", err));

// Initial Product Data
const products = [
    { id: "12345", name: "Special Halo-halo", category: "Special", margin: 80, price: 150, ingredients: 10, status: "Low in Ingredients" },
    { id: "12345", name: "Saba De Leche", category: "Special", margin: 80, price: 120, ingredients: 7, status: "Available" },
    { id: "12345", name: "Mais De Leche", category: "Special", margin: 70, price: 120, ingredients: 8, status: "Not Available" },
    { id: "1234", name: "Mango Graham Shake", category: "Shake", margin: 70, price: 80, ingredients: 8, status: "No ingredients" },
    { id: "12345", name: "Halo-halo", category: "Iced", margin: 50, price: 80, ingredients: 10, status: "Available" },
    { id: "12345", name: "Mango Shake", category: "Shake", margin: 30, price: 60, ingredients: 5, status: "Available" },
    { id: "112345", name: "Melon Shake", category: "Shake", margin: 30, price: 60, ingredients: 5, status: "Available" }
];

// Table Rendering Function
function renderProductTable(data) {
    const tbody = document.getElementById('productTableBody');
    
    tbody.innerHTML = data.map(item => {
        // Create CSS-friendly class names from the status string
        const statusClass = item.status.toLowerCase().trim().replace(/\s+/g, '_');
        
        return `
            <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td>${item.margin}</td>
                <td>${item.price}</td>
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

// Search Logic
document.getElementById('productSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
    );
    renderProductTable(filtered);
});

// Category Filter Logic
const categoryFilter = document.getElementById('categoryFilter');

categoryFilter.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    
    if (selectedCategory === "All Categories") {
        renderProductTable(products);
    } else {
        const filteredData = products.filter(p => p.category === selectedCategory);
        renderProductTable(filteredData);
    }
});

// Price Sorting Logic (Low to High / High to Low)
const priceFilter = document.querySelector('.table-filters .filter-select:last-child');

priceFilter.addEventListener('change', (e) => {
    const sortOrder = e.target.value;
    let sortedData = [...products];

    if (sortOrder === "Low to High") {
        sortedData.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "High to Low") {
        sortedData.sort((a, b) => b.price - a.price);
    }
    
    renderProductTable(sortedData);
});

// Run render on load
document.addEventListener("DOMContentLoaded", () => renderProductTable(products));