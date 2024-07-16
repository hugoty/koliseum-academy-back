import { Request, Response } from "express";
import userService from "../services/userService";
import { isAdmin } from "../utils/checks";
import { genericController } from "../utils/error";

class UserController {

    async getAll(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const users = await userService.getAll();
            res.json(users);
        }, false);
    }

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userData = req.body;
            const newUser = await userService.create(userData);
            res.status(201).json(newUser);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = Number(req.params.id);
            const user = await userService.getById(userId);
            res.json(user);
        });
    }

    async getProfile(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = (req as any).user.id;
            const user = await userService.getById(userId);
            res.json(user);
        }, false);
    }

    async grantCoachRole(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = Number(req.params.id);
            if (isAdmin((req as any).user)) {
                await userService.grantCoachRole(userId);
                res.json({ message: "Coach role granted successfully" });
            }
            else {
                res.status(403).json({ error: "Access to this user denied" });
            }
        });
    }

    async revokeCoachRole(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = Number(req.params.id);
            if (isAdmin((req as any).user)) {
                await userService.revokeCoachRole(userId);
                res.json({ message: "Coach role revoked successfully" });
            }
            else {
                res.status(403).json({ error: "Access to this user denied" });
            }
        });
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = Number(req.params.id);
            const userData = req.body;
            const updatedUser = await userService.update(userId, userData);
            res.json(updatedUser);
        });
    }

    async updateProfile(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = (req as any).user.id;
            const userData = req.body;
            const updatedUser = await userService.update(userId, userData);
            res.json(updatedUser);
        }, false);
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = Number(req.params.id);
            await userService.delete(userId);
            res.json({ message: "User deleted successfully" });
        });
    }

    async deleteProfile(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userId = (req as any).user.id;
            await userService.delete(userId);
            res.json({ message: "User deleted successfully" });
        });
    }
}

export default new UserController();
