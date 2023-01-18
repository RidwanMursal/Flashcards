const jwt = require("jsonwebtoken")

module.exports = {

    authenticateToken: (req, res, next) => {
        const authHeader = req.headers["authorization"] 
        const token = authHeader && authHeader.split(" ")[1] 
        console.log("HIT AUTHENTICATE TOKEN, THIS IS THE TOKEN", token)
      
        if (token === undefined) return res.sendStatus(401) // no token was sent 
        // hash token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(401) // invalid token 
            req.user = user 
            next()
        })
        return;
    
    }
    
}
