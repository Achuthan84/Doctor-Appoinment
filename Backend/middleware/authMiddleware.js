import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        // console.log(token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        };
        const acutalToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token

        const decoded = jwt.verify(
            acutalToken,
            process.env.JWT_SECRET
        )
        req.user = await User.findById(decoded.id)
            .select("-password");
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
}

export default AuthMiddleware;