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
            const subscriptionData = req.body;
            subscriptionData.userId = Number(req.params.id);
            const newSubscription = await subscriptionService.create(subscriptionData);
            res.status(201).json(newSubscription);
        }, false);
    }

    async getById(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const id = Number(req.params.id);
            const course = await subscriptionService.getCourse(id);
            const subscription = await subscriptionService.getById(id);
            if (
                !isAdmin((req as any).user) &&
                course.userId !== (req as any).user.id &&
                subscription.userId !== (req as any).user.id
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
            const course = await subscriptionService.getCourse(subscriptionId);
            if (
                !isAdmin((req as any).user) &&
                course.userId !== (req as any).user.id
            ) throw new Error('CODE403: The user is not the owner of the course');
            const updatedSubscription = await subscriptionService.accept(subscriptionId);
            res.json(updatedSubscription);
        });
    }

    async reject(req: Request, res: Response) {
        await genericController(req, res, async (req: Request, res: Response) => {
            const subscriptionId = Number(req.params.id);
            const course = await subscriptionService.getCourse(subscriptionId);
            if (
                !isAdmin((req as any).user) &&
                course.userId !== (req as any).user.id
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
