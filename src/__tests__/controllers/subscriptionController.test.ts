import request from 'supertest';
import express from 'express';
import subscriptionController from '../../controllers/subscriptionController';
import subscriptionService from '../../services/subscriptionService';
import { isAdmin } from '../../utils/checks';

jest.mock('../../services/subscriptionService');
jest.mock('../../utils/checks');

const app = express();
app.use(express.json());
app.get('/subscriptions', subscriptionController.getAll);
app.post('/subscriptions', subscriptionController.create);
app.post('/courses/:id/subscribe', subscriptionController.subscribe);
app.get('/subscriptions/:id', subscriptionController.getById);
app.put('/subscriptions/:id', subscriptionController.update);
app.delete('/subscriptions/:id', subscriptionController.delete);
app.post('/subscriptions/:id/accept', subscriptionController.accept);
app.post('/subscriptions/:id/reject', subscriptionController.reject);
app.post('/subscriptions/:id/cancel', subscriptionController.cancel);

describe('SubscriptionController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getAll', () => {
        it('devrait retourner toutes les souscriptions', async () => {
            const mockSubscriptions = [{ id: 1, userId: 1, courseId: 1 }];
            (subscriptionService.getAll as jest.Mock).mockResolvedValue(mockSubscriptions);

            const response = await request(app).get('/subscriptions');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSubscriptions);
            expect(subscriptionService.getAll).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('devrait créer une nouvelle souscription', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1 };
            (subscriptionService.create as jest.Mock).mockResolvedValue(mockSubscription);

            const response = await request(app)
                .post('/subscriptions')
                .send({ userId: 1, courseId: 1 });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockSubscription);
            expect(subscriptionService.create).toHaveBeenCalledWith({ userId: 1, courseId: 1 });
        });
    });

    // describe('subscribe', () => {
    //     it('devrait souscrire à un cours', async () => {
    //         const mockSubscription = { id: 1, userId: 1, courseId: 1 };
    //         (subscriptionService.create as jest.Mock).mockResolvedValue(mockSubscription);

    //         const response = await request(app)
    //             .post('/courses/1/subscribe')
    //             .set('Authorization', 'Bearer mocktoken');

    //         expect(response.status).toBe(201);
    //         expect(response.body).toEqual(mockSubscription);
    //         expect(subscriptionService.create).toHaveBeenCalledWith({ userId: undefined, courseId: 1 });
    //     });
    // });

    describe('getById', () => {
        it('devrait retourner une souscription par ID', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1, dataValues: { course: { ownerId: 1 }, userId: 1 } };
            (subscriptionService.getById as jest.Mock).mockResolvedValue(mockSubscription);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app).get('/subscriptions/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSubscription);
            expect(subscriptionService.getById).toHaveBeenCalledWith(1);
        });

        it('devrait retourner une erreur 404 si la souscription n\'existe pas', async () => {
            (subscriptionService.getById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/subscriptions/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Subscription with id 999 not found');
        });
    });

    describe('update', () => {
        it('devrait mettre à jour une souscription', async () => {
            const mockUpdatedSubscription = { id: 1, userId: 1, courseId: 1 };
            (subscriptionService.update as jest.Mock).mockResolvedValue(mockUpdatedSubscription);

            const response = await request(app)
                .put('/subscriptions/1')
                .send({ status: 'Accepted' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedSubscription);
            expect(subscriptionService.update).toHaveBeenCalledWith(1, { status: 'Accepted' });
        });
    });

    describe('delete', () => {
        it('devrait supprimer une souscription', async () => {
            (subscriptionService.delete as jest.Mock).mockResolvedValue();

            const response = await request(app).delete('/subscriptions/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Subscription with id 1 has been deleted');
            expect(subscriptionService.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('accept', () => {
        it('devrait accepter une souscription', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1, dataValues: { course: { dataValues: { owner: { id: 1 } } } } };
            (subscriptionService.getById as jest.Mock).mockResolvedValue(mockSubscription);
            (subscriptionService.accept as jest.Mock).mockResolvedValue(mockSubscription);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .post('/subscriptions/1/accept')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSubscription);
            expect(subscriptionService.accept).toHaveBeenCalledWith(1);
        });
    });

    describe('reject', () => {
        it('devrait rejeter une souscription', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1, dataValues: { course: { ownerId: 1 } } };
            (subscriptionService.getById as jest.Mock).mockResolvedValue(mockSubscription);
            (subscriptionService.reject as jest.Mock).mockResolvedValue(mockSubscription);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .post('/subscriptions/1/reject')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSubscription);
            expect(subscriptionService.reject).toHaveBeenCalledWith(1);
        });
    });

    describe('cancel', () => {
        it('devrait annuler une souscription', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1, dataValues: { course: { ownerId: 1 } } };
            (subscriptionService.getById as jest.Mock).mockResolvedValue(mockSubscription);
            (subscriptionService.cancel as jest.Mock).mockResolvedValue(mockSubscription);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .post('/subscriptions/1/cancel')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSubscription);
            expect(subscriptionService.cancel).toHaveBeenCalledWith(1);
        });
    });
});
