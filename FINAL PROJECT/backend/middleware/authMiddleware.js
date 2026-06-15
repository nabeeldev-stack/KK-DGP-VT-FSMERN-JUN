const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    console.log("Authorization Header:", req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            console.log("Decoded:", decoded);

            req.user = await User.findById(decoded.id);

            console.log("Found User:", req.user);

            next();

        } catch (error) {
            console.log(error);

            return res.status(401).json({
                message: "Not authorized"
            });
        }
    } else {
        return res.status(401).json({
            message: "No token provided"
        });
    }
};

module.exports = { protect };