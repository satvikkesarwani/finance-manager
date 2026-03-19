const express = require("express")
const { connectToMongoDB } = require("./connection")
const path = require("path")
const cors = require("cors")

const userRoute = require("./routes/user")
const billRoute = require("./routes/bill")

const bill = require("./models/bill")

const { checkCookie } = require("./middleware/auth")
const cookieParser = require("cookie-parser")
require('dotenv').config()
const session = require("express-session")
const passport = require("./services/passport")

const app = express()
const PORT = process.env.PORT || 8000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/billmanager";
connectToMongoDB(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

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

app.get("/", (req, res) => {
    res.redirect("http://localhost:5173");
});

app.get("/api/status", (req, res) => {
    res.json({ status: "ok", user: req.user || null });
});

app.get("/api/dashboard", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const allBills = await bill.find({
        createdBy: req.user._id
    })
    const spending = allBills.reduce((acc, b) => acc + b.amount, 0);
    
    return res.json({
        bills: allBills,
        totalSpending: spending,
        user: req.user
    })
})

app.use("/api/user", userRoute)
app.use("/api/bill", billRoute)

app.listen(PORT, () => console.log("Server listening at PORT :", PORT))
