import jwt, { JwtPayload } from "jsonwebtoken";
import User from '../models/User';

export const verifyToken = async (req: any, res: any, next: any) => {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).send({ message: "No token provided." });
    }
    const token = bearerHeader.split(" ")[1];
    if (!token) {
        return res.status(403).send({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "token") as JwtPayload;

        // Vérifier si decoded est défini et a une propriété 'exp'
        if (!decoded || !decoded.exp || decoded.exp < Date.now() / 1000) {
            throw new Error("Invalid access token");
        }

        //find user by id
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res
            .status(403)
            .send({ message: "Failed to authenticate token." });
    }
};