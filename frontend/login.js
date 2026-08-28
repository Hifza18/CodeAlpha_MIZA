const API_URL =
"https://MIZA-no6r.onrender.com/api/auth";

const loginForm =
document.getElementById("loginForm");

const message =
document.getElementById("message");

if (loginForm) {


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        message.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                password
                            })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data.user)
                );


                message.textContent =
                    "Login successful! 🎉";


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1000);


            } else {

                message.textContent =
                    data.message ||
                    "Invalid email or password.";

            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.textContent =
                "Unable to connect to the server.";

        }

    }
);

}
