const express = require("express")
const bill = require("../models/bill")
const router = express.Router()

router.get("/add", async (req, res) => {
    return res.render("add_bill")
})

router.post("/add", async (req, res) => {
    if (!req.user) return res.redirect("/user/login");
    const { purpose, amount, date } = req.body;
    const User = req.user;
    const newBill = await bill.create({
        purpose,
        amount,
        date,
        createdBy: User._id,
    })
    req.user = User
    console.log(newBill)
    return res.redirect("/")
})

router.post("/delete/:id", async (req, res) => {
    if (!req.user) return res.redirect("/user/login");
    const idForDelete = req.params.id
    await bill.deleteOne({
        _id: idForDelete,
        createdBy: req.user._id,
    });
    return res.redirect("/")
})
module.exports = router;