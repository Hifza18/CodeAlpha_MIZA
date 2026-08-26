const express = require("express");

const router = express.Router();
const pool = require("../config/db");

// ===============================
// CREATE ORDER
// ===============================
router.post("/", async (req, res) => {
    try {
        const { user_id, items } = req.body;

        if (!user_id || !items || items.length === 0) {
            return res.status(400).json({
                message: "User ID and cart items are required"
            });
        }

        let totalAmount = 0;

        // Calculate total amount
        for (const item of items) {
            totalAmount +=
                Number(item.price) * Number(item.quantity);
        }

        // Create order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, total_amount, status)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [user_id, totalAmount, "pending"]
        );

        const order = orderResult.rows[0];

        // Add order items
        for (const item of items) {
            await pool.query(
                `INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)`,
                [
                    order.id,
                    item.id,
                    item.quantity,
                    item.price
                ]
            );
        }

        res.status(201).json({
            message: "Order placed successfully",
            order: order
        });

    } catch (error) {

        console.error(
            "Order error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to place order",
            error: error.message
        });
    }
});


// ===============================
// GET ALL ORDERS FOR ADMIN
// ===============================
router.get("/admin/all", async (req, res) => {
    try {

        const ordersResult = await pool.query(
            `SELECT
                id,
                user_id,
                total_amount,
                status,
                created_at
             FROM orders
             ORDER BY created_at DESC`
        );

        const orders = ordersResult.rows;

        // Get items for every order
        for (const order of orders) {

            const itemsResult = await pool.query(
                `SELECT
                    oi.quantity,
                    oi.price,
                    p.name
                 FROM order_items oi
                 JOIN products p
                 ON oi.product_id = p.id
                 WHERE oi.order_id = $1`,
                [order.id]
            );

            order.items = itemsResult.rows;
        }

        res.json(orders);

    } catch (error) {

        console.error(
            "Get all orders error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});


// ===============================
// UPDATE ORDER STATUS (ADMIN)
// ===============================
router.put("/admin/:orderId/status", async (req, res) => {
    try {

        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        // Check status
        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        // Update order
        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, orderId]
        );

        // Check order exists
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
});


// ===============================
// GET ORDERS FOR A USER
// ===============================
router.get("/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        const ordersResult = await pool.query(
            `SELECT *
             FROM orders
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        const orders = ordersResult.rows;

        // Get products/items for each order
        for (const order of orders) {

            const itemsResult = await pool.query(
                `SELECT
                    oi.quantity,
                    oi.price,
                    p.name
                 FROM order_items oi
                 JOIN products p
                 ON oi.product_id = p.id
                 WHERE oi.order_id = $1`,
                [order.id]
            );

            order.items = itemsResult.rows;
        }

        res.json(orders);

    } catch (error) {

        console.error(
            "Get orders error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});


module.exports = router;