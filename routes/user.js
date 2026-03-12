const express = require("express")
const router = express.Router()
const { user, MatchPassword } = require("../models/user")
const { createTokenForUser } = require("../services/auth")
const passport = require("passport")
const crypto = require("crypto")


router.get("/signup", (req, res) => {
    return res.render("signup")
})


router.get("/login", (req, res) => {
    return res.render("login")
})

router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    const newUser = await user.create({
        fullname,
        email,
        password,
    })
    return res.redirect("/user/login")
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const User = await user.findOne({ email: email })
    if (!User) {
        return res.render("login", {
            error: "Incorrect Email or Password"
        })
    }
    const isMatch = await MatchPassword(email, password);

    if (!isMatch) {
        return res.render("login", {
            error: "Incorrect Email or Password"
        })
    }

    const token = createTokenForUser(User)

    return res.cookie("token", token).redirect("/")
})

router.get("/logout", (req, res) => {
    // This clears the cookie named 'token'
    res.clearCookie("token").redirect("/user/login");
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/user/login" }),
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
            return res.cookie("token", token).redirect("/");
        } catch (error) {
            console.error("Google Auth Error:", error);
            return res.redirect("/user/login");
        }
    }
);

module.exports = router;