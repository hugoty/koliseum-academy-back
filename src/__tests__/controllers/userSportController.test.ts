import request from 'supertest';
import express from 'express';
import userSportController from '../../controllers/userSportController';
import userSportService from '../../services/userSportService';
import { isAdmin } from '../../utils/checks';

jest.mock('../../services/userSportService');
jest.mock('../../utils/checks');

const app = express();
app.use(express.json());
app.post('/users/:id/sports/:sportId', userSportController.create);
app.put('/users/sports/:id', userSportController.update);
app.delete('/users/sports/:id', userSportController.delete);
app.post('/users/sports/:id/add', userSportController.addSport);
app.put('/users/sports/:id/update', userSportController.updateSport);
app.delete('/users/sports/:id/remove', userSportController.removeSport);

app.use((req, res, next) => {
    (req as any).user = { id: 999 }; // Utilisateur fictif avec un id fixe pour les tests
    next();
});

describe('UserSportController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('create', () => {
        it('devrait créer une relation utilisateur-sport', async () => {
            const mockUserSport = { userId: 1, sportId: 2 };
            (userSportService.create as jest.Mock).mockResolvedValue(mockUserSport);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .post('/users/1/sports/2')
                .set('Authorization', 'Bearer mocktoken')
                .send({ level: 'beginner' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockUserSport);
            expect(userSportService.create).toHaveBeenCalledWith({ userId: 1, sportId: 2, level: 'beginner' });
        });
    });

    describe('update', () => {
        it('devrait mettre à jour une relation utilisateur-sport', async () => {
            const mockUpdatedUserSport = { userId: 1, sportId: 2, level: 'intermediate' };
            (userSportService.getById as jest.Mock).mockResolvedValue({ dataValues: { userId: 1 } });
            (userSportService.update as jest.Mock).mockResolvedValue(mockUpdatedUserSport);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .put('/users/sports/1')
                .set('Authorization', 'Bearer mocktoken')
                .send({ level: 'intermediate' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedUserSport);
            expect(userSportService.update).toHaveBeenCalledWith(1, { level: 'intermediate' });
        });
    });

    describe('delete', () => {
        it('devrait supprimer une relation utilisateur-sport', async () => {
            (userSportService.getById as jest.Mock).mockResolvedValue({ dataValues: { userId: 1 } });
            (userSportService.delete as jest.Mock);
            (isAdmin as jest.Mock).mockReturnValue(true);

            const response = await request(app)
                .delete('/users/sports/1')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User\'s sport deleted successfully');
            expect(userSportService.delete).toHaveBeenCalledWith(1);
        });
    });

    // describe('addSport', () => {
    //     it('devrait ajouter un sport à l\'utilisateur', async () => {
    //         const mockUserSport = { userId: 1, sportId: 2 };
    //         (userSportService.create as jest.Mock).mockResolvedValue(mockUserSport);

    //         const response = await request(app)
    //             .post('/users/sports/2/add')
    //             .set('Authorization', 'Bearer mocktoken')
    //             .send({ level: 'beginner' });

    //         expect(response.status).toBe(201);
    //         expect(response.body).toEqual(mockUserSport);
    //         expect(userSportService.create).toHaveBeenCalledWith({ userId: 1, sportId: 2, level: 'beginner' });
    //     });
    // });

    describe('updateSport', () => {
        it('devrait mettre à jour le sport de l\'utilisateur', async () => {
            const mockUpdatedUserSport = { userId: 1, sportId: 2, level: 'advanced' };
            (userSportService.update as jest.Mock).mockResolvedValue(mockUpdatedUserSport);

            const response = await request(app)
                .put('/users/sports/2/update')
                .set('Authorization', 'Bearer mocktoken')
                .send({ level: 'advanced' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedUserSport);
            expect(userSportService.update).toHaveBeenCalledWith(2, { level: 'advanced' });
        });
    });

    describe('removeSport', () => {
        it('devrait supprimer le sport de l\'utilisateur', async () => {
            (userSportService.delete as jest.Mock);

            const response = await request(app)
                .delete('/users/sports/2/remove')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User\'s sport deleted successfully');
            expect(userSportService.delete).toHaveBeenCalledWith(2);
        });
    });
});
