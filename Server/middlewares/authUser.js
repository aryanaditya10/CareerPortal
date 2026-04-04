import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authorized",
                success: false,
            })
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            })
        }

        req.id = decode.userId;
        req.role = decode.role;

        next();



    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
        });
    }
}


export default authUser;