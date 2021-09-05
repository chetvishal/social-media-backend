const jwt = require('jsonwebtoken')
const secret = process.env['SECRET']

const AuthVerification = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log("req params", req)
    try {
        const decoded = jwt.verify(token, secret);
        res.user = decoded;
        return next();
    } catch (error) {
        console.log("auth error: ", error.message)
        return res.status(401).json({ message: "Unauthorised access, please add right token" })
    }
}

module.exports = { AuthVerification }