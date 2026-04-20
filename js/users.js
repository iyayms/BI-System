document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    renderUsersTable(userData);
    setupFilters();
    setupModalLogic();
    setupEditModalLogic();
    setupStatusModalLogic();
    setupDeleteModalLogic();
});

/* =========================
SIDEBAR LOADING
========================= */
function loadSidebar() {
    fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        const container = document.getElementById("sidebar-container");
        if(container){
            container.innerHTML = data;
            const links = document.querySelectorAll(".menu a");
            links.forEach(link => {
                if(link.getAttribute("href").includes("users.html")){
                    link.classList.add("active");
                }
            });
        }
    })
    .catch(err => console.error("Error loading sidebar:", err));
}

/* =========================
USER DATA (MOCK)
========================= */
const userData = [
    { name: "AYA", email: "user@gmail.com", created: "1/11/2026", role: "ADMIN", status: "ACTIVE" },
    { name: "JUAN", email: "user@gmail.com", created: "1/11/2026", role: "USER", status: "ACTIVE" },
    { name: "MIGUEL", email: "user@gmail.com", created: "1/11/2026", role: "OWNER", status: "ACTIVE" }
];

/* =========================
RENDER TABLE
========================= */
let currentEditIndex = null;

function renderUsersTable(data) {
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    tbody.innerHTML = data.map((user, index) => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.created}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>
                <div class="actions-cell">
                    <i class="ph ph-note-pencil" title="Edit User" onclick="openEditModal(${index})"></i>
                    <i class="ph ph-user-minus" title="Update Status" onclick="openStatusModal(${index})"></i>
                    ${user.role !== 'ADMIN' ? `<i class="ph ph-trash" title="Delete" onclick="deleteUser(${index})"></i>` : ''}
                </div>
            </td>
        </tr>
    `).join("");
}

/* =========================
FILTER LOGIC
========================= */
function setupFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // UI Toggle
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Filter Logic
            const role = btn.getAttribute("data-role");
            if (role === "ALL ROLES") {
                renderUsersTable(userData);
            } else {
                const filtered = userData.filter(u => u.role === role);
                renderUsersTable(filtered);
            }
        });
    });
}

function setupModalLogic() {
    const modal = document.getElementById("addUserModal");
    const form = document.getElementById("addUserForm");
    const openBtn = document.getElementById("addUserBtn"); // The trigger button
    const closeBtn = document.getElementById("closeModalBtn");

    // 1. Open Modal Trigger
    if (openBtn) {
        openBtn.onclick = () => {
            modal.classList.add("active");
            document.body.style.overflow = 'hidden';
        };
    }

    // 2. Handle Form Submission
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault(); 

            const nameInput = document.getElementById("newName").value.toUpperCase();
            const emailInput = document.getElementById("newEmail").value;
            const roleInput = document.getElementById("newRole").value;
            const rawDate = document.getElementById("newDate").value; // Returns YYYY-MM-DD

            // Split the date and rearrange to MM/DD/YYYY
            let formattedDate = "";
            if (rawDate) {
                const [year, month, day] = rawDate.split("-");
                formattedDate = `${month}/${day}/${year}`;
            } else {
                // Fallback to current date if empty
                const today = new Date();
                formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
            }

            const newUser = {
                name: nameInput,
                email: emailInput,
                created: formattedDate, // Use the rearranged string here
                role: roleInput,
                status: "ACTIVE"
            };

            userData.push(newUser);
            renderUsersTable(userData);

            // Using your existing showToast function logic
            if (typeof showToast === "function") {
                showToast(`Account for ${nameInput} created!`, "success");
            }
            
            closeModal();
        };
    }

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto';
        form.reset();
    };

    if (closeBtn) closeBtn.onclick = closeModal;

    // Close on overlay click
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function openEditModal(index) {
    currentEditIndex = index;
    const user = userData[index];
    const modal = document.getElementById("editUserModal");

    // Populate the form with existing data
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editDate").value = user.created; // Read-only
    document.getElementById("editRole").value = user.role;
    document.getElementById("editStatus").value = user.status;

    modal.classList.add("active");
    document.body.style.overflow = 'hidden';
}

function setupEditModalLogic() {
    const modal = document.getElementById("editUserModal");
    const form = document.getElementById("editUserForm");
    const closeBtn = document.getElementById("closeEditModalBtn");

    form.onsubmit = (e) => {
        e.preventDefault();

        // Update the item in the userData array
        userData[currentEditIndex] = {
            ...userData[currentEditIndex], // Keep original date and other hidden fields
            name: document.getElementById("editName").value.toUpperCase(),
            email: document.getElementById("editEmail").value,
            role: document.getElementById("editRole").value,
        };

        renderUsersTable(userData);
        
        if (typeof showToast === "function") {
            showToast(`User ${userData[currentEditIndex].name} updated!`, "success");
        }
        
        closeEditModal();
    };

    const closeEditModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto';
    };

    closeBtn.onclick = closeEditModal;

    modal.onclick = (e) => {
        if (e.target === modal) closeEditModal();
    };
}

function openStatusModal(index) {
    currentStatusIndex = index;
    const user = userData[index];
    const modal = document.getElementById("statusUserModal");

    document.getElementById("statusUserName").value = user.name;
    document.getElementById("updateStatus").value = user.status;

    modal.classList.add("active");
    document.body.style.overflow = 'hidden';
}

function setupStatusModalLogic() {
    const modal = document.getElementById("statusUserModal");
    const form = document.getElementById("statusUserForm");
    const closeBtn = document.getElementById("closeStatusModalBtn");

    form.onsubmit = (e) => {
        e.preventDefault();

        // Update only the status in the data array
        userData[currentStatusIndex].status = document.getElementById("updateStatus").value;

        renderUsersTable(userData);
        
        if (typeof showToast === "function") {
            showToast(`Status for ${userData[currentStatusIndex].name} updated to ${userData[currentStatusIndex].status}`, "success");
        }
        
        closeStatusModal();
    };

    const closeStatusModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto';
    };

    closeBtn.onclick = closeStatusModal;

    modal.onclick = (e) => {
        if (e.target === modal) closeStatusModal();
    };
}

let currentDeleteIndex = null;

function deleteUser(index) {
    currentDeleteIndex = index;
    const modal = document.getElementById("deleteUserModal");
    modal.classList.add("active");
    document.body.style.overflow = 'hidden';
}

function setupDeleteModalLogic() {
    const modal = document.getElementById("deleteUserModal");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const closeBtn = document.getElementById("closeDeleteModalBtn");

    confirmBtn.onclick = () => {
        const deletedUserName = userData[currentDeleteIndex].name;
        
        // Remove from the array
        userData.splice(currentDeleteIndex, 1);
        
        // Refresh the table
        renderUsersTable(userData);
        
        if (typeof showToast === "function") {
            showToast(`Account for ${deletedUserName} has been removed.`, "error");
        }
        
        closeDeleteModal();
    };

    const closeDeleteModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto';
        currentDeleteIndex = null;
    };

    closeBtn.onclick = closeDeleteModal;

    modal.onclick = (e) => {
        if (e.target === modal) closeDeleteModal();
    };
}
