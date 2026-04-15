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