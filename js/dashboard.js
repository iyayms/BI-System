document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById("salesChart").getContext("2d");

    let chart;

    const salesData = [
    {date:"2026-04-21", category:"fruits", product:"Mango", qty:3, revenue:150},
    {date:"2026-04-21", category:"dairy", product:"Milk", qty:2, revenue:120},
    {date:"2026-04-21", category:"powder", product:"Milo", qty:4, revenue:200},

    {date:"2026-04-20", category:"fruits", product:"Banana", qty:5, revenue:250},
    {date:"2026-04-20", category:"toppings", product:"Graham", qty:2, revenue:100},

    {date:"2026-04-19", category:"dairy", product:"Condensed Milk", qty:3, revenue:150},
    {date:"2026-04-18", category:"materials", product:"Cup", qty:10, revenue:100},

    {date:"2026-04-17", category:"ice", product:"Crushed Ice", qty:6, revenue:120},
    {date:"2026-04-16", category:"syrup", product:"Chocolate Syrup", qty:3, revenue:90},

    {date:"2026-04-15", category:"sinkers", product:"Nata", qty:4, revenue:160}
    ];

    const dataSets = {
        Daily: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            revenue: [200, 400, 300, 500, 450],
            funds: [150, 200, 250, 300, 280],
            others: [50, 80, 60, 90, 70]
        },
        Weekly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            revenue: [500, 900, 1200, 1000],
            funds: [300, 600, 800, 700],
            others: [200, 300, 400, 350]
        },
        Monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr"],
            revenue: [2000, 3000, 2500, 4000],
            funds: [1500, 2000, 1800, 2200],
            others: [500, 800, 700, 900]
        }
    };

    const purchaseHistoryData = [
    // ================= DAILY (2026-04-21) =================
    { id: 1, date: "2026-04-21", product: "Mango Shake", category: "fruits", qty: 2, price: 120, total: 240 },
    { id: 2, date: "2026-04-21", product: "Milk Tea", category: "dairy", qty: 3, price: 90, total: 270 },
    { id: 3, date: "2026-04-21", product: "Milo Drink", category: "powder", qty: 1, price: 80, total: 80 },
    { id: 4, date: "2026-04-21", product: "Graham Float", category: "toppings", qty: 2, price: 110, total: 220 },
    { id: 5, date: "2026-04-21", product: "Ice Coffee", category: "syrup", qty: 4, price: 70, total: 280 },

    // ================= RECENT DAYS =================
    { id: 6, date: "2026-04-20", product: "Banana Shake", category: "fruits", qty: 3, price: 100, total: 300 },
    { id: 7, date: "2026-04-20", product: "Condensed Milk Drink", category: "dairy", qty: 2, price: 95, total: 190 },
    { id: 8, date: "2026-04-19", product: "Strawberry Shake", category: "fruits", qty: 1, price: 130, total: 130 },
    { id: 9, date: "2026-04-18", product: "Choco Powder Drink", category: "powder", qty: 5, price: 85, total: 425 },
    { id: 10, date: "2026-04-17", product: "Halo-Halo", category: "sinkers", qty: 2, price: 150, total: 300 },

    // ================= WEEK 1 =================
    { id: 11, date: "2026-04-14", product: "Mango Float", category: "toppings", qty: 2, price: 140, total: 280 },
    { id: 12, date: "2026-04-13", product: "Vanilla Shake", category: "dairy", qty: 3, price: 110, total: 330 },
    { id: 13, date: "2026-04-12", product: "Ice Cream Float", category: "dairy", qty: 1, price: 160, total: 160 },
    { id: 14, date: "2026-04-11", product: "Chocolate Syrup Drink", category: "syrup", qty: 2, price: 95, total: 190 },

    // ================= WEEK 2 =================
    { id: 15, date: "2026-04-08", product: "Banana Split", category: "sinkers", qty: 2, price: 170, total: 340 },
    { id: 16, date: "2026-04-07", product: "Coffee Jelly", category: "sinkers", qty: 3, price: 120, total: 360 },
    { id: 17, date: "2026-04-06", product: "Strawberry Milk", category: "dairy", qty: 2, price: 100, total: 200 },

    // ================= MONTHLY (EARLY APRIL) =================
    { id: 18, date: "2026-04-03", product: "Large Milk Tea", category: "dairy", qty: 5, price: 95, total: 475 },
    { id: 19, date: "2026-04-02", product: "Mango Shake Large", category: "fruits", qty: 4, price: 130, total: 520 },
    { id: 20, date: "2026-04-01", product: "Choco Float", category: "powder", qty: 3, price: 120, total: 360 }
    ];

    function createChart(type = "Weekly") {
        const d = dataSets[type];

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: d.labels,
                datasets: [
                    {
                        label: "Revenue",
                        data: d.revenue,
                        borderColor: "#6b2d1a",
                        backgroundColor: "#6b2d1a",
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#6b2d1a",
                        borderWidth: 2
                    },
                    {
                        label: "Funds",
                        data: d.funds,
                        borderColor: "#e67e22",
                        backgroundColor: "#e67e22",
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#e67e22",
                        borderWidth: 2
                    },
                    {
                        label: "Others",
                        data: d.others,
                        borderColor: "#f1c40f",
                        backgroundColor: "#f1c40f",
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#f1c40f",
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                layout: {
                    padding: 10
                },

                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            pointStyle: "circle",
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: "#fff",
                        titleColor: "#000",
                        bodyColor: "#000",
                        borderColor: "#ddd",
                        borderWidth: 1
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: "#eee"
                        },
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    }

    createChart();

    document.querySelector(".report-dropdown")
        .addEventListener("change", (e) => {
            createChart(e.target.value);
        });

    /* COUNT ANIMATION */
    document.querySelectorAll(".count").forEach(counter => {
        let target = +counter.dataset.target;
        let count = 0;
        let speed = target / 50;

        function update() {
            count += speed;
            if (count < target) {
                counter.innerText = Math.floor(count);
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
            }
        }

        update();
    });

    function filterSales(){

    const dateFilter = document.getElementById("dateFilter").value;
    const categoryFilter = document.getElementById("categoryFilter").value;

    const today = new Date("2026-04-21");

    let filtered = salesData.filter(item=>{

        const itemDate = new Date(item.date);
        const diffDays = (today - itemDate) / (1000*60*60*24);

        let dateMatch = true;

        if(dateFilter === "day"){
            dateMatch = diffDays <= 1;
        }

        if(dateFilter === "week"){
            dateMatch = diffDays <= 7;
        }

        if(dateFilter === "month"){
            dateMatch = diffDays <= 30;
        }

        let categoryMatch = categoryFilter === "all" || item.category === categoryFilter;

        return dateMatch && categoryMatch;

    });

    updateChart(filtered);

}

    function updateChart(data){

    const labels = data.map(item => item.product);
    const revenue = data.map(item => item.revenue);

    if(chart) chart.destroy();

    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Revenue",
                data:revenue,
                backgroundColor:"#e67e22"
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false
        }
    });

}

    function filterPurchaseHistory(timeFilter, categoryFilter) {

        const today = new Date("2026-04-21");

        return purchaseHistoryData.filter(item => {

            const itemDate = new Date(item.date);
            const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);

            let timeMatch = true;

            if (timeFilter === "day") {
                timeMatch = diffDays <= 1;
            }

            if (timeFilter === "week") {
                timeMatch = diffDays <= 7;
            }

            if (timeFilter === "month") {
                timeMatch = diffDays <= 30;
            }

            let categoryMatch =
                categoryFilter === "all" || item.category === categoryFilter;

            return timeMatch && categoryMatch;
        });
    }

    /* MODAL */
    const modal = document.getElementById("restockModal");

    document.querySelectorAll(".restock-btn").forEach(btn => {
        btn.onclick = () => modal.style.display = "flex";
    });

    document.getElementById("confirmRestock").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

});

document.getElementById("dateFilter")
    .addEventListener("change", filterSales);

document.getElementById("categoryFilter")
    .addEventListener("change", filterSales);

filterSales();