import { Request, Response } from "express";
import subscriptionService from "../services/subscriptionService";
import { isAdmin } from "../utils/checks";
import { genericController } from "../utils/error";

class SubscriptionController {

    async getAll(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const subscriptions = await subscriptionService.getAll();
            res.json(subscriptions);
        }, false);
    }

    async create(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const newSubscription = await subscriptionService.create(req.body);
            res.status(201).json(newSubscription);
        }, false);
    }

    async subscribe(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const newSubscription = await subscriptionService.create({
                userId: (req as any).user.id,
                courseId: Number(req.params.id)
            });
            res.status(201).json(newSubscription);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const id = Number(req.params.id);
            const subscription = await subscriptionService.getById(id);
            if (
                !isAdmin((req as any).user) &&
                subscription.dataValues.course.ownerId !== (req as any).user.id &&
                subscription.dataValues.userId !== (req as any).user.id
            ) throw new Error('CODE403: The user is not the owner of this subscription');
            if (!subscription) {
                res.status(404).json({ message: `Subscription with id ${id} not found` });
                return;
            }
            res.json(subscription);
        });
    }

    async update(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const id = Number(req.params.id);
            const subscriptionData = req.body;
            const updatedSubscription = await subscriptionService.update(id, subscriptionData);
            res.json(updatedSubscription);
        });
    }

    async delete(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const id = Number(req.params.id);
            await subscriptionService.delete(id);
            res.json({ message: `Subscription with id ${id} has been deleted` });
        });
    }

    async accept(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const subscriptionId = Number(req.params.id);
            const subscription = await subscriptionService.getById(subscriptionId);
            if (
                !isAdmin((req as any).user) &&
                subscription.dataValues.course.dataValues.owner.id !== (req as any).user.id
            ) throw new Error('CODE403: The user is not the owner of the course');
            const updatedSubscription = await subscriptionService.accept(subscriptionId);
            res.json(updatedSubscription);
        });
    }

    async reject(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const subscriptionId = Number(req.params.id);
            const subscription = await subscriptionService.getById(subscriptionId);
            if (
                !isAdmin((req as any).user) &&
                subscription.dataValues.course.ownerId !== (req as any).user.id
            ) throw new Error('CODE403: The user is not the owner of the course');
            const updatedSubscription = await subscriptionService.reject(subscriptionId);
            res.json(updatedSubscription);
        });
    }

    async cancel(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const subscriptionId = Number(req.params.id);
            const subscription = await subscriptionService.getById(subscriptionId);
            if (
                !isAdmin((req as any).user) &&
                subscription.userId !== (req as any).user.id
            ) throw new Error('CODE403: The user is not the owner of this subscription');
            const updatedSubscription = await subscriptionService.cancel(subscriptionId);
            res.json(updatedSubscription);
        });
    }
}

export default new SubscriptionController();
