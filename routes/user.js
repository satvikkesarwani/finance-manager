const express = require("express")
const router = express.Router()
const { user, MatchPassword } = require("../models/user")
const { createTokenForUser } = require("../services/auth")
const passport = require("passport")
const crypto = require("crypto")

const FRONTEND_URL = process.env.FRONTEND_URL || "";

router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const newUser = await user.create({
            fullname,
            email,
            password,
        })
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const User = await user.findOne({ email: email })
    if (!User) {
        return res.status(401).json({ error: "Incorrect Email or Password" });
    }
    const isMatch = await MatchPassword(email, password);

    if (!isMatch) {
        return res.status(401).json({ error: "Incorrect Email or Password" });
    }

    const token = createTokenForUser(User)

    return res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }).json({ message: "Login successful", user: { id: User._id, fullname: User.fullname, email: User.email } });
})

router.get("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
});

router.get("/status", (req, res) => {
    if (req.user) {
        return res.json({ user: req.user });
    }
    return res.status(401).json({ error: "Not authenticated" });
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed` }),
    async (req, res) => {
        const profile = req.user;
        const email = profile.emails[0].value;
        const fullname = profile.displayName;
        
        try {
            let User = await user.findOne({ email });

            if (!User) {
                const randomPassword = crypto.randomBytes(16).toString("hex");
                User = await user.create({
                    fullname,
                    email,
                    password: randomPassword
                });
            }

            const token = createTokenForUser(User);
            return res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            }).redirect(FRONTEND_URL);
        } catch (error) {
            console.error("Google Auth Error:", error);
            return res.redirect(`${FRONTEND_URL}/login?error=internal_error`);
        }
    }
);

module.exports = router;