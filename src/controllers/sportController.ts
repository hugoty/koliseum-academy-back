import { Request, Response } from "express";
import SportService from "../services/sportService";
import { genericController } from "../utils/error";

class SportController {

    async getAll(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const sports = await SportService.getAll();
            res.json(sports);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const sport = await SportService.getById(Number(req.params.id));
            res.json(sport);
        });
    }

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const sportData = req.body;
            const newSport = await SportService.create(sportData);
            res.status(201).json(newSport);
        }, false);
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const sportData = req.body;
            const updatedSport = await SportService.update(Number(req.params.id), sportData);
            res.json(updatedSport);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            await SportService.delete(Number(req.params.id));
            res.json({ message: 'Sport deleted successfully' });
        });
    }
}

export default new SportController();
