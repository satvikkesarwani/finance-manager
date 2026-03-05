const {validateToken} = require("../services/auth")

function checkCookie (cookiename){
    return (req,res,next) =>{
        const tokenValue = req.cookies[cookiename]
        if(!tokenValue) return next()

        try {
            const userPayload = validateToken(tokenValue);
            req.user = userPayload;
            res.locals.user = userPayload;
        }
        catch (error) { }
        return next()
    }
}

module.exports={
    checkCookie,
}

