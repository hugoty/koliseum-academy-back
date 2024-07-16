import { NextFunction, Request, Response } from "express";
import { Role } from "../models/data";
import User from "../models/user";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (
            !('user' in req) ||
            !req.user ||
            !('id' in (req as any).user) ||
            !(req.user as any).id
        ) return res.status(500).json({ message: `Could not find user's informations` });

        const roles = (req.user as User).roles;
        if (!roles) throw new Error('Could not get the user\'s roles');

        if (!roles.includes(Role.Admin)) {
            return res.status(403).json({ message: `Only Admins can access this resource` });
        }

        next(); // Next middleware or route
    } catch (error) {
        console.error("Error verifying role:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
