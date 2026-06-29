const API_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

/* =========================
   AUTH GUARD
========================= */

if (!token) {
    window.location.href = "login.html";
}

if (role !== "Admin") {
    alert("Access denied");
    window.location.href = "login.html";
}

/* =========================
   NAVIGATION
========================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".nav-item")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            document
                .querySelectorAll(".section")
                .forEach(section =>
                    section.classList.remove("active")
                );

            button.classList.add("active");

            const section =
                button.dataset.section;

            document
                .getElementById(section)
                .classList.add("active");

        });

    });

/* =========================
   LOAD USERS
========================= */

async function loadUsers() {

    try {

        const response = await fetch(
            `${API_URL}/admin/users`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const users = await response.json();

        renderUsers(users);

        document.getElementById(
            "totalUsers"
        ).textContent = users.length;

        const moderators =
            users.filter(user =>
                user.roles &&
                user.roles.some(
                    role =>
                        role.name === "Moderator"
                )
            );

        document.getElementById(
            "totalModerators"
        ).textContent =
            moderators.length;

    } catch (error) {

        console.error(error);

        alert("Failed to load users");

    }

}

/* =========================
   RENDER USERS
========================= */

function renderUsers(users) {

    const table =
        document.getElementById(
            "usersTableBody"
        );

    table.innerHTML = "";

    users.forEach(user => {

        const role =
            user.roles?.[0]?.name ||
            "Student";

        table.innerHTML += `
            <tr>

                <td>${user.id}</td>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${role}</td>

                <td>

                    <button
                        onclick="changeRole(${user.id}, '${role}')"
                    >
                        Change Role
                    </button>

                </td>

            </tr>
        `;

    });

}

/* =========================
   CHANGE ROLE
========================= */

async function changeRole(
    userId,
    currentRole
) {

    const newRole =
        prompt(
            "Enter role (Admin, Moderator, Student)",
            currentRole
        );

    if (!newRole) return;

    try {

        const response = await fetch(
            `${API_URL}/admin/users/${userId}/role`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    role: newRole
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Role update failed"
            );

        }

        alert(
            "Role updated successfully"
        );

        loadUsers();

    } catch (error) {

        alert(error.message);

    }

}

/* =========================
   CREATE MODERATOR
========================= */

document
    .getElementById(
        "createModeratorForm"
    )
    .addEventListener(
        "submit",
        async e => {

            e.preventDefault();

            const name =
                document.getElementById(
                    "moderatorName"
                ).value;

            const email =
                document.getElementById(
                    "moderatorEmail"
                ).value;

            const password =
                document.getElementById(
                    "moderatorPassword"
                ).value;

            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/moderators`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Creation failed"
                    );

                }

                alert(
                    "Moderator created successfully"
                );

                e.target.reset();

                loadUsers();

            } catch (error) {

                alert(error.message);

            }

        }
    );

/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        async () => {

            try {

                await fetch(
                    `${API_URL}/logout`,
                    {
                        method: "POST",

                        headers: {
                            Accept:
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            } catch (error) {}

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "role"
            );

            window.location.href =
                "login.html";

        }
    );

/* =========================
   INIT
========================= */

loadUsers();
