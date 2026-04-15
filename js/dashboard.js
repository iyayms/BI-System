const menuItems = document.querySelectorAll(".menu li")
const tabs = document.querySelectorAll(".tab")

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        /* remove active sidebar */
        menuItems.forEach(i => i.classList.remove("active"))

        /* add active sidebar */
        item.classList.add("active")

        /* hide all tabs */
        tabs.forEach(tab => tab.classList.remove("activeTab"))

        /* show selected tab */
        const tabID = item.getAttribute("data-tab")
        document.getElementById(tabID).classList.add("activeTab")

    })

})