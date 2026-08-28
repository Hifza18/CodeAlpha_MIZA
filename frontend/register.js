const API_URL = "https://MIZAH-no6r.onrender.com/api/auth";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

if (registerForm) {


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    message.textContent = "Creating your account...";

    try {

        const response = await fetch(
            `${API_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Registration successful! 🎉";

            registerForm.reset();

        } else {

            message.textContent =
                data.message ||
                "Registration failed.";

        }

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        message.textContent =
            "Unable to connect to the server.";

    }

});


}
