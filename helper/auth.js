const jwt = require("jsonwebtoken")
const config = require("./config")

const jwtAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                // console.log(`id: ${verify.id}`);
                req.user = user;
                next();
            }
        });
    } catch (e) {
        res.json({
            message: "Access Denied"
        })
    }
}

module.exports = jwtAuth;