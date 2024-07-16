import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(403).send({ message: "No token provided." });
    }

    const token = bearerHeader.split(" ")[1];
    if (!token) {
        return res.status(403).send({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded || !decoded.exp || decoded.exp < Date.now() / 1000) {
            throw new Error("Invalid access token");
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(403).send({ message: "Failed to authenticate token." });
    }
};
