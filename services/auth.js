const jwt = require("jsonwebtoken")
const secret = "RcbIplWinner2026"

function createTokenForUser(user){
    const payload={
        _id: user._id,
        fullname: user.fullname,
        email: user.email
    }
    const token = jwt.sign(payload,secret, { expiresIn: "1h" })
    return token;
}

function validateToken(token){
    const payload = jwt.verify(token,secret)
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
}