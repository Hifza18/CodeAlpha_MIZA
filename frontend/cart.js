let total = 0;

cart.forEach((item, index) => {

    const itemTotal = Number(item.price) * Number(item.quantity);
    total += itemTotal;

    const cartItem = document.createElement("div");

    cartItem.className = "product-card";

    cartItem.innerHTML = `
        <h3>${item.name}</h3>

        <p>Price: ₹${item.price}</p>

        <div>
            <button onclick="decreaseQuantity(${index})">−</button>

            <strong> ${item.quantity} </strong>

            <button onclick="increaseQuantity(${index})">+</button>
        </div>

        <p>Subtotal: ₹${itemTotal}</p>

        <button onclick="removeItem(${index})">
            Remove
        </button>
    `;

    cartContainer.appendChild(cartItem);
});

cartTotal.innerHTML = `<h3>Total: ₹${total}</h3>`;