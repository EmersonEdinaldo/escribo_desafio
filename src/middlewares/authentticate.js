const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
    console.log('middleware');
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            msg: "Token not provided"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({
            msg: "Invalid token type"
        });
    }

    const [schemaType, token] = parts;

    if (schemaType !== "Bearer") {
        return res.status(401).json({
            msg: "Token malformatted"
        });
    }

    return jwt.verify(token, authConfig.secret, (err, decoded) => {
        console.log(err);
        console.log(decoded);

        if (err) {
            return res.status(401).json({
                msg: "Token invalid/expired"
            });
        }

        req.userLogged = decoded;

        console.log(err);
        console.log(decoded);

        return next();
    });
};