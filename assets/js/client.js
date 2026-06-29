const API_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("token");

const user =
    JSON.parse(
        localStorage.getItem("user") || "{}"
    );

if (!token) {

    window.location.href =
        "login.html";

}

/* =========================
   USER
========================= */

document.getElementById(
    "studentName"
).textContent =
    user.name || "Student";

/* =========================
   NAVIGATION
========================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".nav-item")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                document
                    .querySelectorAll(".section")
                    .forEach(section =>
                        section.classList.remove(
                            "active"
                        )
                    );

                button.classList.add(
                    "active"
                );

                document
                    .getElementById(
                        button.dataset.section
                    )
                    .classList.add(
                        "active"
                    );

            }
        );

    });

/* =========================
   COURSES
========================= */

async function loadCourses() {

    try {

        const response =
            await fetch(
                `${API_URL}/courses`
            );

        const courses =
            await response.json();

        document.getElementById(
            "totalCourses"
        ).textContent =
            courses.length;

        renderCourses(courses);

    } catch (error) {

        console.error(error);

        alert(
            "Failed to load courses"
        );

    }

}

function renderCourses(courses) {

    const container =
        document.getElementById(
            "coursesContainer"
        );

    container.innerHTML = "";

    courses.forEach(course => {

        container.innerHTML += `
            <div class="card">

                <h3>
                    ${course.title}
                </h3>

                <p>
                    ${course.description || ""}
                </p>

                <p>
                    $${course.price}
                </p>

                <button
                    onclick="enrollCourse(${course.id})"
                >
                    Enroll
                </button>

            </div>
        `;

    });

}

/* =========================
   ENROLL
========================= */

async function enrollCourse(
    courseId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/courses/${courseId}/enroll`,
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

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Enrollment failed"
            );

        }

        alert(
            "Enrollment successful"
        );

        loadMyCourses();

    } catch (error) {

        alert(error.message);

    }

}

/* =========================
   MY COURSES
========================= */

async function loadMyCourses() {

    try {

        const response =
            await fetch(
                `${API_URL}/my-courses`,
                {
                    headers: {
                        Accept:
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const courses =
            await response.json();

        document.getElementById(
            "totalMyCourses"
        ).textContent =
            courses.length;

        renderMyCourses(courses);

    } catch (error) {

        console.error(error);

    }

}

function renderMyCourses(
    courses
) {

    const container =
        document.getElementById(
            "myCoursesContainer"
        );

    container.innerHTML = "";

    if (!courses.length) {

        container.innerHTML =
            "<p>No enrolled courses yet.</p>";

        return;

    }

    courses.forEach(course => {

        container.innerHTML += `
            <div class="card">

                <h3>
                    ${course.title}
                </h3>

                <p>
                    ${course.description || ""}
                </p>

                <p>
                    Enrolled
                </p>

            </div>
        `;

    });

}

/* =========================
   LOGOUT
========================= */

document
    .getElementById(
        "logoutBtn"
    )
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

            localStorage.clear();

            window.location.href =
                "login.html";

        }
    );

/* =========================
   INIT
========================= */

loadCourses();
loadMyCourses();
