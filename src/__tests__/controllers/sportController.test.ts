import request from 'supertest';
import express from 'express';
import sportController from '../../controllers/sportController';
import sportService from '../../services/sportService';

jest.mock('../../services/sportService');

const app = express();
app.use(express.json());
app.get('/sports', sportController.getAll);
app.get('/sports/:id', sportController.getById);
app.post('/sports', sportController.create);
app.put('/sports/:id', sportController.update);
app.delete('/sports/:id', sportController.delete);

describe('SportController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getAll', () => {
        it('devrait retourner tous les sports', async () => {
            const mockSports = [{ id: 1, name: 'Football' }];
            (sportService.getAll as jest.Mock).mockResolvedValue(mockSports);

            const response = await request(app).get('/sports');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSports);
            expect(sportService.getAll).toHaveBeenCalled();
        });
    });

    describe('getById', () => {
        it('devrait retourner un sport par ID', async () => {
            const mockSport = { id: 1, name: 'Football' };
            (sportService.getById as jest.Mock).mockResolvedValue(mockSport);

            const response = await request(app).get('/sports/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockSport);
            expect(sportService.getById).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('devrait créer un nouveau sport', async () => {
            const mockSport = { id: 1, name: 'Football' };
            (sportService.create as jest.Mock).mockResolvedValue(mockSport);

            const response = await request(app)
                .post('/sports')
                .send({ name: 'Football' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockSport);
            expect(sportService.create).toHaveBeenCalledWith({ name: 'Football' });
        });
    });

    describe('update', () => {
        it('devrait mettre à jour un sport', async () => {
            const mockUpdatedSport = { id: 1, name: 'Updated Football' };
            (sportService.update as jest.Mock).mockResolvedValue(mockUpdatedSport);

            const response = await request(app)
                .put('/sports/1')
                .send({ name: 'Updated Football' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedSport);
            expect(sportService.update).toHaveBeenCalledWith(1, { name: 'Updated Football' });
        });
    });

    describe('delete', () => {
        it('devrait supprimer un sport', async () => {
            (sportService.delete as jest.Mock);

            const response = await request(app).delete('/sports/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Sport deleted successfully' });
            expect(sportService.delete).toHaveBeenCalledWith(1);
        });
    });
});
