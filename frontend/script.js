const API_URL = "https://zevora-no6r.onrender.com/api/products";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let selectedCategory = "All";
let searchText = "";

// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {


const container = document.getElementById("productsContainer");

if (!container) {
    return;
}

try {

    container.innerHTML = `
        <div class="loading">
            Loading products...
        </div>
    `;

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            `Server returned ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Invalid products response");
    }

    products = data;

    displayProducts();

    updateCartButton();

} catch (error) {

    console.error("Product loading error:", error);

    container.innerHTML = `
        <div class="loading">
            <h3>Unable to load products</h3>
            <p>Please try again later.</p>
        </div>
    `;
}


}

// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {


const container =
    document.getElementById("productsContainer");

const productCount =
    document.getElementById("productCount");

if (!container) {
    return;
}


// =================================
// FILTER
// =================================

const filteredProducts = products.filter(product => {

    const category =
        String(product.category || "").trim();

    const name =
        String(product.name || "").toLowerCase();

    const description =
        String(product.description || "").toLowerCase();

    const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() ===
        selectedCategory.toLowerCase();

    const search =
        searchText.toLowerCase();

    const matchesSearch =
        name.includes(search) ||
        description.includes(search) ||
        category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
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
// CLEAR CONTAINER
// =================================

container.innerHTML = "";


// =================================
// CREATE PRODUCT CARDS
// =================================

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
                alt="${escapeHTML(product.name)}"
                class="product-image"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >

            <div
                class="no-image"
                style="display:none;"
            >
                🛍️
            </div>
        `;

    } else {

        imageHTML = `
            <div class="no-image">
                🛍️
            </div>
        `;
    }


    // =================================
    // STOCK
    // =================================

    const stock =
        Number(product.stock) || 0;

    let stockText;
    let buttonText;
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
            "Add to Cart 🛒";
    }


    // =================================
    // CARD HTML
    // =================================

    card.innerHTML = `

        ${imageHTML}

        <h3>
            ${escapeHTML(product.name)}
        </h3>

        <p>
            ${escapeHTML(
                product.description ||
                "Quality product from ZEVORA."
            )}
        </p>

        <p>
            <strong>
                ₹${Number(product.price || 0).toFixed(2)}
            </strong>
        </p>

        <p>
            ${stockText}
        </p>

        <button
            class="add-cart-button"
            data-product-id="${product.id}"
            ${disabled}
        >
            ${buttonText}
        </button>

    `;


    // =================================
    // ADD TO CART EVENT
    // =================================

    const addButton =
        card.querySelector(".add-cart-button");

    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                addToCart(product.id);

            }
        );
    }


    container.appendChild(card);

});
```

}

// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

```
const div =
    document.createElement("div");

div.textContent =
    value;

return div.innerHTML;
```

}

// =====================================
// SEARCH
// =====================================

function setupSearch() {

```
const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


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


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchText =
                    searchInput.value.trim();

            }

            displayProducts();

        }
    );
}
```

}

// =====================================
// CATEGORY FILTER
// =====================================

function setupCategories() {

```
const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedCategory =
                button.dataset.category || "All";


            categoryButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            displayProducts();

        }
    );
});
```

}

// =====================================
// ADD TO CART
// =====================================

function addToCart(productId) {

```
const product =
    products.find(
        item =>
            Number(item.id) ===
            Number(productId)
    );


if (!product) {

    alert("Product not found.");

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
        item =>
            Number(item.id) ===
            Number(product.id)
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

        id: Number(product.id),

        name: product.name,

        price: Number(product.price),

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
```

}

// =====================================
// UPDATE CART BUTTON
// =====================================

function updateCartButton() {

```
const cartButton =
    document.getElementById("cartButton");


if (!cartButton) {
    return;
}


const totalItems =
    cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );


cartButton.textContent =
    `Cart 🛍️ (${totalItems})`;
```

}

// =====================================
// CART BUTTON
// =====================================

function setupCartButton() {


const cart Button =
    document.getElementById("cartButton");


if (!cartButton) {
    return;
}


cartButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "cart.html";

    }
);
```

}

// =====================================
// ORDERS BUTTON
// =====================================

function setupOrdersButton() {


const ordersButton =
    document.getElementById("ordersButton");


if (!ordersButton) {
    return;
}


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
// LOGIN / LOGOUT / USER
// =====================================

function setupUserButtons() {


const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const welcomeUser =
    document.getElementById("welcomeUser");


const user =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );


// =================================
// USER LOGGED IN
// =================================

if (user) {

    if (welcomeUser) {

        welcomeUser.textContent =
            `Welcome, ${user.name || "User"} 👋`;

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

}

// =================================
// USER NOT LOGGED IN
// =================================

else {

    if (welcomeUser) {

        welcomeUser.textContent = "";

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


// =================================
// LOGIN
// =================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";

        }
    );
}


// =================================
// LOGOUT
// =================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

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
```

}

// =====================================
// SHOP NOW
// =====================================

function setupShopNow() {

```
const shopNowButton =
    document.getElementById(
        "shopNowButton"
    );


if (!shopNowButton) {
    return;
}


shopNowButton.addEventListener(
    "click",
    () => {

        const productsContainer =
            document.getElementById(
                "productsContainer"
            );


        if (productsContainer) {

            productsContainer.scrollIntoView({
                behavior: "smooth"
            });

        }
    }
);


}

// =====================================
// START WEBSITE
// =====================================

document.addEventListener(
"DOMContentLoaded",
() => {

    setupSearch();

    setupCategories();

    setupCartButton();

    setupOrdersButton();

    setupUserButtons();

    setupShopNow();

    updateCartButton();

    loadProducts();

});
