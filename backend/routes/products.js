const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// GET ALL PRODUCTS
// ======================================

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching products:", error.message);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});


// ======================================
// ADD PRODUCT
// ======================================

router.post("/", async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            image_url,
            category,
            stock
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Name and price are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO products
            (name, description, price, image_url, category, stock)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                name,
                description || "",
                price,
                image_url || null,
                category || "",
                stock || 0
            ]
        );

        res.status(201).json({
            message: "Product added successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error adding product:", error.message);

        res.status(500).json({
            message: "Failed to add product"
        });
    }
});


// ======================================
// UPDATE PRODUCT
// ======================================

router.put("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const {
            name,
            description,
            price,
            image_url,
            category,
            stock
        } = req.body;

        const result = await pool.query(
            `UPDATE products
            SET name = $1,
                description = $2,
                price = $3,
                image_url = $4,
                category = $5,
                stock = $6
            WHERE id = $7
            RETURNING *`,
            [
                name,
                description || "",
                price,
                image_url || null,
                category || "",
                stock || 0,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating product:", error.message);

        res.status(500).json({
            message: "Failed to update product"
        });
    }
});


// ======================================
// DELETE PRODUCT
// ======================================

router.delete("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting product:", error.message);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
});


module.exports = router;