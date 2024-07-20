import Subscription from "../models/subscription";
import { checkAttr } from "../utils/checks";
import { genericServRepo } from "../utils/error";

class SubscriptionRepository {

    async getAll() {
        return await genericServRepo('subscriptionRepository.getAll', 'Error fetching all subscriptions', [], async () => {
            const subscriptions = await Subscription.findAll();
            return subscriptions;
        });
    }

    async create(data: any) {
        return await genericServRepo('subscriptionRepository.create', 'Error creating subscription', [data], async (data) => {
            data = checkAttr(data, 'user', ['userId', 'courseId'], ['id']);
            const newSubscription = await Subscription.create(data);
            return newSubscription;
        });
    }

    async getById(id: number) {
        return await genericServRepo('subscriptionRepository.getById', 'Error fetching subscription', [id], async (id) => {
            const subscription = await Subscription.findByPk(id);
            if (!subscription) {
                throw new Error(`CODE404: Subscription not found`);
            }
            return subscription;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('subscriptionRepository.update', 'Error updating subscription', [id, data], async (id, data) => {
            const subscription = await Subscription.findByPk(id);
            if (!subscription) {
                throw new Error(`CODE404: Subscription not found`);
            }
            data = checkAttr(data, 'subscription', [], ['userId', 'courseId', 'id']);
            await subscription.update(data);
            return subscription;
        });
    }

    async delete(id: number) {
        return await genericServRepo('subscriptionRepository.delete', 'Error deleting subscription', [id], async (id) => {
            const subscription = await Subscription.findByPk(id);
            if (!subscription) {
                throw new Error(`CODE404: Subscription not found`);
            }
            await subscription.destroy();
            return subscription;
        });
    }
}

export default new SubscriptionRepository();
