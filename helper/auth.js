const jwt = require("jsonwebtoken")
const config = require("./config")

const jwtAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, config.secret);
        // console.log(`id: ${verify.id}`);
        next();
    } catch (e) {
        res.json({
            message: "Access Denied"
        })
    }
}

module.exports = jwtAuth;