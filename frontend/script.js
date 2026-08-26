const API_URL = "https://zevora-no6r.onrender.com/api/products";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let selectedCategory = "All";
let searchText = "";


// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    const container =
        document.getElementById("productsContainer");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products =
            await response.json();

        displayProducts();

        updateCartButton();

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load products.</p>";
    }
}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {

    const container =
        document.getElementById(
            "productsContainer"
        );

    const productCount =
        document.getElementById(
            "productCount"
        );

    if (!container) {
        return;
    }


    // =================================
    // FILTER PRODUCTS
    // =================================

    const filteredProducts =
        products.filter(product => {

            const matchesCategory =
                selectedCategory === "All" ||
                (
                    product.category &&
                    product.category.toLowerCase() ===
                    selectedCategory.toLowerCase()
                );


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    ) ||

                (
                    product.description || ""
                )
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    );


            return (
                matchesCategory &&
                matchesSearch
            );
        });


    // =================================
    // PRODUCT COUNT
    // =================================

    if (productCount) {

        productCount.textContent =
            `${filteredProducts.length} product${
                filteredProducts.length !== 1
                    ? "s"
                    : ""
            }`;
    }


    // =================================
    // NO PRODUCTS
    // =================================

    if (filteredProducts.length === 0) {

        container.innerHTML = `

            <div class="loading">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    // =================================
    // DISPLAY
    // =================================

    container.innerHTML = "";


    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        // =================================
        // IMAGE
        // =================================

        let imageHTML = "";


        if (product.image_url) {

            imageHTML = `

                <img
                    src="${product.image_url}"
                    alt="${product.name}"
                    onerror="this.style.display='none';"
                >

            `;

        } else {

            imageHTML = `

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >
                    No Image
                </div>

            `;
        }


        // =================================
        // STOCK
        // =================================

        const stock =
            Number(product.stock) || 0;


        let stockText = "";
        let buttonText = "";
        let disabled = "";


        if (stock <= 0) {

            stockText =
                "Out of Stock";

            buttonText =
                "Out of Stock";

            disabled =
                "disabled";

        } else {

            stockText =
                `Stock: ${stock}`;

            buttonText =
                "Add to Cart";
        }


        // =================================
        // CARD
        // =================================

        card.innerHTML = `

            ${imageHTML}

            <h3>
                ${product.name}
            </h3>


            <p>
                ${product.description || ""}
            </p>


            <p>
                <strong>
                    ₹${Number(product.price).toFixed(2)}
                </strong>
            </p>


            <p>
                ${stockText}
            </p>


            <button
                onclick="addToCart(${product.id})"
                ${disabled}
            >
                ${buttonText}
            </button>

        `;


        container.appendChild(card);

    });
}


// =====================================
// SEARCH
// =====================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            searchText =
                searchInput.value.trim();

            displayProducts();

        }
    );
}


// =====================================
// SEARCH BUTTON
// =====================================

const searchButton =
    document.getElementById(
        "searchButton"
    );


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            searchText =
                searchInput.value.trim();

            displayProducts();

        }
    );
}


// =====================================
// CATEGORY BUTTONS
// =====================================

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedCategory =
                button.dataset.category;


            // Remove active
            categoryButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            // Add active
            button.classList.add(
                "active"
            );


            displayProducts();

        }
    );

});


// =====================================
// ADD TO CART
// =====================================

function addToCart(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


    if (!product) {

        alert(
            "Product not found"
        );

        return;
    }


    const stock =
        Number(product.stock) || 0;


    if (stock <= 0) {

        alert(
            "This product is out of stock."
        );

        return;
    }


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        if (
            existingProduct.quantity >= stock
        ) {

            alert(
                "You cannot add more than the available stock."
            );

            return;
        }


        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartButton();


    alert(
        `${product.name} added to cart!`
    );
}


// =====================================
// CART BUTTON
// =====================================

function updateCartButton() {

    const cartButton =
        document.getElementById(
            "cartButton"
        );


    if (!cartButton) {
        return;
    }


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartButton.textContent =
        `🛍️ Cart (${totalItems})`;
}


// =====================================
// CART BUTTON CLICK
// =====================================

const cartButton =
    document.getElementById(
        "cartButton"
    );


if (cartButton) {

    cartButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "cart.html";

        }
    );
}


// =====================================
// MY ORDERS
// =====================================

const ordersButton =
    document.getElementById(
        "ordersButton"
    );


if (ordersButton) {

    ordersButton.addEventListener(
        "click",
        () => {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "loggedInUser"
                    )
                );


            if (!user) {

                alert(
                    "Please login to view your orders."
                );


                window.location.href =
                    "login.html";


                return;
            }


            window.location.href =
                "orders.html";

        }
    );
}


// =====================================
// DISPLAY USER
// =====================================

function displayUser() {

    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (user) {

        if (welcomeUser) {

            welcomeUser.textContent =
                `Welcome, ${user.name} 👋`;

            welcomeUser.style.display =
                "inline-block";
        }


        if (loginButton) {

            loginButton.style.display =
                "none";
        }


        if (logoutButton) {

            logoutButton.style.display =
                "inline-block";
        }

    } else {

        if (welcomeUser) {

            welcomeUser.textContent =
                "";
        }


        if (loginButton) {

            loginButton.style.display =
                "inline-block";
        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";
        }
    }
}


// =====================================
// LOGIN
// =====================================

const loginButton =
    document.getElementById(
        "loginButton"
    );


if (loginButton) {

    loginButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );
}


// =====================================
// LOGOUT
// =====================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "loggedInUser"
            );


            window.location.href =
                "index.html";

        }
    );
}


// =====================================
// START
// =====================================

displayUser();

loadProducts();
// =====================================
// ZEVORA NAVIGATION & LOGIN
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const loginButton =
        document.getElementById("loginButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const ordersButton =
        document.getElementById("ordersButton");

    const cartButton =
        document.getElementById("cartButton");

    const welcomeUser =
        document.getElementById("welcomeUser");


    // =================================
    // CHECK LOGIN
    // =================================

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    if (loggedInUser) {

        // Show username
        welcomeUser.textContent =
            `Hi, ${loggedInUser.name || "User"} 👋`;

        // Hide login
        if (loginButton) {
            loginButton.style.display = "none";
        }

        // Show logout
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
        }

    } else {

        // Hide welcome
        welcomeUser.textContent = "";

        // Show login
        if (loginButton) {
            loginButton.style.display = "inline-block";
        }

        // Hide logout
        if (logoutButton) {
            logoutButton.style.display = "none";
        }
    }


    // =================================
    // LOGIN BUTTON
    // =================================

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "login.html";

            }
        );

    }


    // =================================
    // LOGOUT BUTTON
    // =================================

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "loggedInUser"
                );

                alert(
                    "You have been logged out."
                );

                window.location.href =
                    "index.html";

            }
        );

    }


    // =================================
    // ORDERS BUTTON
    // =================================

    if (ordersButton) {

        ordersButton.addEventListener(
            "click",
            function () {

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "loggedInUser"
                        )
                    );


                if (!user) {

                    alert(
                        "Please login to view your orders."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                window.location.href =
                    "orders.html";

            }
        );

    }


    // =================================
    // CART BUTTON
    // =================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "cart.html";

            }
        );

    }

});