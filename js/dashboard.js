document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById("salesChart").getContext("2d");

    let chart;

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