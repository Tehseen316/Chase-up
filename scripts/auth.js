document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("#signupForm");
    const loginForm = document.querySelector("#loginForm");

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullName = document.querySelector("#signupName").value;
            const email = document.querySelector("#signupEmail").value;
            const password = document.querySelector("#signupPassword").value;
            const confirmPassword = document.querySelector("#signupConfirmPassword").value;
            const role = document.querySelector("#signupRole").value; 

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const userData = { fullName, email, password, role };

            try {
                const response = await fetch("http://localhost:5004/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Signup successful! Redirecting to login...");
                    window.location.href = "login.html";
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Error signing up. Try again.");
            }
        });
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.querySelector("#loginEmail").value;
            const password = document.querySelector("#loginPassword").value;

            const loginData = { email, password };

            try {
                const response = await fetch("http://localhost:5004/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Login successful!");
                    window.location.href = "dashboard.html";
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Error logging in. Try again.");
            }
        });
    }
});
