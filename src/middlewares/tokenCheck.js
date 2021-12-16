const jwt = require("jsonwebtoken");

const tokenCheck = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: "Token not found, login again" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token is not valid" });
        }
        req.user = decoded;
        next();
    });
}

module.exports = tokenCheck;