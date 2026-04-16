document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
});

function loadSidebar() {
    fetch('../components/sidebar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            setActiveLink();
        })
        .catch(err => console.error("Sidebar load error:", err));
}

function setActiveLink() {
    const links = document.querySelectorAll(".sidebar .menu a");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}