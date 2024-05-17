import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const newUser = await UserService.createUser(userData);
            res.json(newUser);
        } catch (error) {
            //res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
