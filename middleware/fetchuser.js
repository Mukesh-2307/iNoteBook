const jwt = require("jsonwebtoken")
const JWT_SECRET = "theSecretCode"

const fetchuser = (req, res, next) => {

    // retriving user from jwt token and appending id to req obj
    try {
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: 'please authenticate using a valid token'})
    }
    else{
        let data = jwt.verify(token,JWT_SECRET)
        req.user = data.user
    }
    next()
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: 'please authenticate using a valid token'})
    }
}


module.exports = fetchuser;