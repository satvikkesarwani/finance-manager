const express = require("express")
const bill = require("../models/bill")
const router = express.Router()

router.get("/dashboard", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const bills = await bill.find({ createdBy: req.user._id }).sort({ date: -1 });
        const totalSpending = bills.reduce((acc, curr) => acc + curr.amount, 0);
        return res.json({ bills, totalSpending });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post("/add", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { purpose, amount, date } = req.body;
    try {
        const newBill = await bill.create({
            purpose,
            amount,
            date,
            createdBy: req.user._id,
        })
        return res.status(201).json(newBill);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

router.post("/delete/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const idForDelete = req.params.id
    try {
        await bill.deleteOne({
            _id: idForDelete,
            createdBy: req.user._id,
        });
        return res.json({ message: "Bill deleted successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

module.exports = router;