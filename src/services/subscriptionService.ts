import { RequestStatus } from "../models/data";
import courseRepository from "../repositories/courseRepository";
import subscriptionRepository from "../repositories/subscriptionRepository";
import { genericServRepo } from "../utils/error";
import courseService from "./courseService";
import userService from "./userService";

class SubscriptionService {

    async getAll() {
        return await genericServRepo('subscriptionService.getAll', 'Error fetching all subscriptions', [], async () => {
            const subscriptions = await subscriptionRepository.getAll();
            return subscriptions;
        });
    }

    async create(data: any) {
        return await genericServRepo('subscriptionService.create', 'Error creating subscription', [data], async (data) => {
            const course = await courseRepository.getById(data.courseId);
            if (course.remainingPlaces === 0) throw new Error('CODE400: no remaining places in this course');
            const newSubscription = await subscriptionRepository.create(data);
            return newSubscription;
        });
    }

    async getById(id: number) {
        return await genericServRepo('subscriptionService.getById', 'Error fetching subscription', [id], async (id) => {
            const subscription = await subscriptionRepository.getById(id);
            subscription.dataValues.user = await userService.getById(subscription.userId);
            subscription.dataValues.course = await courseService.getById(subscription.courseId);
            return subscription;
        });
    }

    async accept(id: number) {
        return await genericServRepo('subscriptionService.accept', 'Error accepting subscription', [id], async (id) => {
            const subscription = await subscriptionRepository.getById(id);
            if (subscription.status === RequestStatus.Canceled) throw new Error('Cannot accept a canceled subscription');
            const course = await courseRepository.getById(subscription.courseId);
            if (course.remainingPlaces === 0) throw new Error('CODE400: no remaining places in this course');
            const updatedSubscription = await subscriptionRepository.update(id, { status: RequestStatus.Accepted });
            await courseRepository.update(subscription.courseId, { remainingPlaces: course.remainingPlaces - 1 });
            return updatedSubscription;
        });
    }

    async reject(id: number) {
        return await genericServRepo('subscriptionService.reject', 'Error rejecting subscription', [id], async (id) => {
            const subscription = await subscriptionRepository.getById(id);
            if (subscription.status === RequestStatus.Canceled) throw new Error('Cannot reject a canceled subscription');
            const updatedSubscription = await subscriptionRepository.update(id, { status: RequestStatus.Rejected });
            return updatedSubscription;
        });
    }

    async cancel(id: number) {
        return await genericServRepo('subscriptionService.cancel', 'Error canceling subscription', [id], async (id) => {
            const subscription = await subscriptionRepository.getById(id);
            const updatedSubscription = await subscriptionRepository.update(id, { status: RequestStatus.Canceled });
            if (subscription.status === RequestStatus.Accepted) {
                const course = await courseRepository.getById(subscription.courseId);
                await courseRepository.update(subscription.courseId, { remainingPlaces: course.remainingPlaces + 1 });
            }
            return updatedSubscription;
        });
    }

    async update(id: number, data: any) {
        return await genericServRepo('subscriptionService.update', 'Error updating subscription', [id, data], async (id, data) => {
            const updatedSubscription = await subscriptionRepository.update(id, data);
            return updatedSubscription;
        });
    }

    async delete(id: number) {
        return await genericServRepo('subscriptionService.delete', 'Error deleting', [id], async (id) => {
            const deletedSubscription = await subscriptionRepository.delete(id);
            return deletedSubscription;
        });
    }
}

export default new SubscriptionService();
