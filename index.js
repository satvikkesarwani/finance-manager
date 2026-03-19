const express = require("express")
const { connectToMongoDB } = require("./connection")
const path = require("path")

const userRoute = require("./routes/user")
const billRoute = require("./routes/bill")

const bill = require("./models/bill")

const { checkCookie } = require("./middleware/auth")
const cookieParser = require("cookie-parser")
require('dotenv').config()
const session = require("express-session")
const passport = require("./services/passport")

const app = express()
const PORT = process.env.PORT ||8000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/billmanager";
connectToMongoDB(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
    secret: "session_secret_123",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(checkCookie("token"))

app.get("/", async (req, res) => {
    if (!req.user) {
        return res.redirect("/user/login");
    }
    const allBills = await bill.find({
        createdBy: req.user._id
    })
    const length = allBills.length
    let spending = 0;
    for (let i = 0; i < length; i++) {
        spending += allBills[i].amount
    }
    return res.render("home", {
        bill: allBills,
        spend: spending,
    })
})

app.use("/user", userRoute)
app.use("/bill", billRoute)

app.listen(PORT, () => console.log("Server listening at PORT :", 8000))
