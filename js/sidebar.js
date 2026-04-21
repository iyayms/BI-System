fetch("../components/sidebar.html")
.then(res => res.text())
.then(data => {

    document.getElementById("sidebar-container").innerHTML = data

    const links = document.querySelectorAll(".menu a")

    const currentPage = window.location.pathname.split("/").pop()

    links.forEach(link => {

        const linkPage = link.getAttribute("href")

        if (linkPage.includes(currentPage)) {
            link.classList.add("active")
        }

    })

})

// Add this inside your loadSidebar() function or as a global handler
document.addEventListener("click", (e) => {
    const link = e.target.closest(".menu a");
    
    if (link && !link.classList.contains("active")) {
        e.preventDefault(); // Pause the navigation
        const targetUrl = link.getAttribute("href");

        // Apply a fade-out class to the main container
        const mainContent = document.querySelector("main") || document.querySelector(".layout");
        if (mainContent) {
            mainContent.style.transition = "opacity 0.2s ease-in, transform 0.2s ease-in";
            mainContent.style.opacity = "0";
            mainContent.style.transform = "translateY(-10px)";
        }

        // Navigate after the short animation
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    }
});