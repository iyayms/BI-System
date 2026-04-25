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
            if(link.getAttribute("href").includes("salesanalytics.html")){
                link.classList.add("active");
            }
        });
    }
})
.catch(err=>console.error("Error loading sidebar:", err));

document.addEventListener("DOMContentLoaded", () => {

    initAnalytics();
});

function initAnalytics() {
    // 1. Shared Chart Options (Defined once outside)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 30,
                    font: { weight: 'bold' }
                }
            }
        },
        layout: {
            padding: { top: 20, bottom: 40, left: 20, right: 30 }
        },
        scales: {
        x: {
            ticks: {
                padding: 10 // Adds space between the x-axis labels and the actual axis line
            }
        },
        y: { 
            beginAtZero: false 
        }
        }
    };

    // 2. Mock Data
    const timeline = ['Jan 1-15', 'Jan 16-31', 'Feb 1-15', 'Feb 16-28', 'Mar 1-15'];
    const revenueData = [4500, 5200, 6800, 8900, 12450];
    const costData = [3800, 4100, 4500, 5000, 5500];

    // 3. Update Top Cards
    document.getElementById("totalRevenue").innerText = `PHP ${revenueData[4].toLocaleString()}`;
    document.getElementById("totalCost").innerText = `PHP ${costData[4].toLocaleString()}`;
    document.getElementById("breakEvenValue").innerText = `PHP ${(revenueData[4] - costData[4]).toLocaleString()}`;
    document.getElementById("transactionCount").innerText = "142";

    // --- CHART 1: REVENUE ---
    const revCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revCtx, {
        type: 'line',
        data: {
            labels: timeline,
            datasets: [{
                label: 'Gross Sales',
                data: revenueData,
                borderColor: '#e0b15c',
                backgroundColor: 'rgba(224, 177, 92, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 5,
            }]
        },
        options: chartOptions // Applying the shared options correctly
    });

    // --- CHART 2: CATEGORY SALES ---
    const catCtx = document.getElementById('salesCategoryChart').getContext('2d');
    new Chart(catCtx, {
        type: 'line',
        data: {
            labels: timeline,
            datasets: [
                { label: 'Special', data: [20, 35, 45, 60, 85], borderColor: '#6b2d1a', tension: 0.3 },
                { label: 'Shake', data: [30, 40, 35, 55, 75], borderColor: '#e0b15c', tension: 0.3 },
                { label: 'Iced', data: [25, 30, 50, 45, 65], borderColor: '#2c2c2c', tension: 0.3 }
            ]
        },
        options: chartOptions
    });

    // --- CHART 3: BREAK-EVEN ---
    const beCtx = document.getElementById('breakEvenChart').getContext('2d');
    new Chart(beCtx, {
        type: 'line',
        data: {
            labels: timeline,
            datasets: [
                {
                    label: 'Cumulative Revenue',
                    data: revenueData,
                    borderColor: '#28a745',
                    borderWidth: 4,
                    fill: false
                },
                {
                    label: 'Total Fixed + Variable Costs',
                    data: costData,
                    borderColor: '#dc3545',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: chartOptions
    });

    // --- CHART 4: MOST PROFITABLE PRODUCTS ---
    const profCtx = document.getElementById('profitableProductsChart').getContext('2d');
    new Chart(profCtx, {
        type: 'bar',
        data: {
            labels: ['Mango Special', 'Oreo Shake', 'Matcha Iced', 'Strawberry Special', 'Taro Shake'],
            datasets: [{
                label: 'Gross Profit (PHP)',
                data: [4850, 3920, 3410, 2980, 2540],
                backgroundColor: [
                    'rgba(107, 45, 26, 0.85)',
                    'rgba(224, 177, 92, 0.85)',
                    'rgba(44, 44, 44, 0.75)',
                    'rgba(107, 45, 26, 0.6)',
                    'rgba(224, 177, 92, 0.5)',
                ],
                borderColor: [
                    '#6b2d1a',
                    '#e0b15c',
                    '#2c2c2c',
                    '#6b2d1a',
                    '#e0b15c',
                ],
                borderWidth: 2,
                borderRadius: 6,
            }]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',  // Horizontal bars — easier to read product names
            plugins: {
                ...chartOptions.plugins,
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: val => `₱${val.toLocaleString()}`,
                        padding: 10
                    }
                },
                y: {
                    ticks: { padding: 8 }
                }
            }
        }
    });
}