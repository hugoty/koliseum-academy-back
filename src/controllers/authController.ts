import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { checkAttr } from "../utils/checks";

class AuthController {
    async login(req: Request, res: Response) {
        const body = checkAttr(req.body, 'req.body', ['email', 'password']);
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Invalid email." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password." });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: 31_556_952_000 });
            res.json({ token });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export default new AuthController();
