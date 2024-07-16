import { Request, Response } from "express";
import userSportService from "../services/userSportService";
import { isAdmin } from "../utils/checks";
import { genericController } from "../utils/error";

class UserSportController {

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportData = req.body;
            userSportData.userId = Number(req.params.id);
            userSportData.sportId = Number(req.params.sportId);
            if (isAdmin((req as any).user) || (req as any).user.id === userSportData.userId) {
                const newUserSport = await userSportService.create(userSportData);
                res.status(201).json(newUserSport);
            }
            else res.status(403).json({ error: "Access to this user denied" });
        });
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportData = req.body;
            const userSportId = Number(req.params.id);
            const userSport = await userSportService.getById(userSportId);
            if (isAdmin((req as any).user) || (req as any).user.id === userSport.userId) {
                const updatedUserSport = await userSportService.update(userSportId, userSportData);
                res.json(updatedUserSport);
            }
            else res.status(403).json({ error: "Access to this user denied" });
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportId = Number(req.params.id);
            const userSport = await userSportService.getById(userSportId);
            if (isAdmin((req as any).user) || (req as any).user.id === userSport.userId) {
                await userSportService.delete(userSportId);
                res.json({ message: 'User\'s sport deleted successfully' });
            }
            else res.status(403).json({ error: "Access to this user denied" });
        });
    }

    async addSport(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportData = req.body;
            userSportData.userId = (req as any).user.id;
            userSportData.sportId = Number(req.params.id);
            const newUserSport = await userSportService.create(userSportData);
            res.status(201).json(newUserSport);
        });
    }

    async updateSport(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportData = req.body;
            const userSportId = Number(req.params.id);
            const updatedUserSport = await userSportService.update(userSportId, userSportData);
            res.json(updatedUserSport);
        });
    }

    async removeSport(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const userSportId = Number(req.params.id);
            const userSport = await userSportService.getById(userSportId);
            await userSportService.delete(userSportId);
            res.json({ message: 'User\'s sport deleted successfully' });
        });
    }
}

export default new UserSportController();
