import request from 'supertest';
import express from 'express';
import userController from '../../controllers/UserController';
import userService from '../../services/userService';
import { isAdmin } from '../../utils/checks';

jest.mock('../../services/userService');
jest.mock('../../utils/checks');

const app = express();
app.use(express.json());

// Ajout d'un middleware pour mock req.user
app.use((req, res, next) => {
    (req as any).user = { id: 999 }; // Utilisateur fictif avec un id fixe pour les tests
    next();
});

app.get('/users', userController.getAll);
app.post('/users/search-coaches', userController.searchCoaches);
app.post('/users', userController.create);
app.get('/users/:id', userController.getById);
app.get('/users/profile', userController.getProfile);
app.post('/users/:id/grant-coach', userController.grantCoachRole);
app.post('/users/:id/revoke-coach', userController.revokeCoachRole);
app.put('/users/:id', userController.update);
app.put('/users/profile', userController.updateProfile);
app.delete('/users/:id', userController.delete);
app.delete('/users/profile', userController.deleteProfile);

describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getAll', () => {
        it('devrait retourner tous les utilisateurs', async () => {
            const mockUsers = [{ id: 1, name: 'John Doe' }];
            (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(userService.getAll).toHaveBeenCalled();
        });
    });

    describe('searchCoaches', () => {
        it('devrait rechercher les coachs', async () => {
            const mockCoaches = [{ id: 1, name: 'Coach John' }];
            (userService.searchCoaches as jest.Mock).mockResolvedValue(mockCoaches);

            const response = await request(app)
                .post('/users/search-coaches')
                .send({ name: 'John' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCoaches);
            expect(userService.searchCoaches).toHaveBeenCalledWith({ name: 'John' });
        });
    });

    describe('create', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const mockUser = { id: 1, name: 'Jane Doe' };
            (userService.create as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/users')
                .send({ name: 'Jane Doe' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockUser);
            expect(userService.create).toHaveBeenCalledWith({ name: 'Jane Doe' });
        });
    });

    describe('getById', () => {
        it('devrait retourner un utilisateur par ID', async () => {
            const mockUser = { id: 1, name: 'John Doe' };
            (userService.getById as jest.Mock).mockResolvedValue(mockUser);
            (isAdmin as jest.Mock).mockReturnValue(false);

            const response = await request(app).get('/users/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
            expect(userService.getById).toHaveBeenCalledWith(1, true);
        });
    });

    describe('getProfile', () => {
        it('devrait retourner le profil de l\'utilisateur', async () => {
            const mockUser = { id: 999, name: 'Current User' };
            (userService.getById as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get('/users/profile');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });
    });

    describe('grantCoachRole', () => {
        it('devrait attribuer le rôle de coach à un utilisateur', async () => {
            (isAdmin as jest.Mock).mockReturnValue(true);
            (userService.grantCoachRole as jest.Mock);

            const response = await request(app)
                .post('/users/1/grant-coach')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Coach role granted successfully');
            expect(userService.grantCoachRole).toHaveBeenCalledWith(1);
        });

        it('devrait retourner une erreur 403 si l\'utilisateur n\'a pas l\'autorisation', async () => {
            (isAdmin as jest.Mock).mockReturnValue(false);

            const response = await request(app)
                .post('/users/1/grant-coach')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Access to this user denied');
        });
    });

    describe('revokeCoachRole', () => {
        it('devrait révoquer le rôle de coach d\'un utilisateur', async () => {
            (isAdmin as jest.Mock).mockReturnValue(true);
            (userService.revokeCoachRole as jest.Mock);

            const response = await request(app)
                .post('/users/1/revoke-coach')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Coach role revoked successfully');
            expect(userService.revokeCoachRole).toHaveBeenCalledWith(1);
        });

        it('devrait retourner une erreur 403 si l\'utilisateur n\'a pas l\'autorisation', async () => {
            (isAdmin as jest.Mock).mockReturnValue(false);

            const response = await request(app)
                .post('/users/1/revoke-coach')
                .set('Authorization', 'Bearer mocktoken');

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Access to this user denied');
        });
    });

    describe('update', () => {
        it('devrait mettre à jour un utilisateur', async () => {
            const mockUpdatedUser = { id: 1, name: 'John Updated' };
            (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const response = await request(app)
                .put('/users/1')
                .send({ name: 'John Updated' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedUser);
            expect(userService.update).toHaveBeenCalledWith(1, { name: 'John Updated' });
        });
    });

    describe('delete', () => {
        it('devrait supprimer un utilisateur', async () => {
            (userService.delete as jest.Mock);

            const response = await request(app).delete('/users/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
            expect(userService.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('updateProfile', () => {
        it('devrait mettre à jour le profil de l\'utilisateur', async () => {
            const mockUpdatedUser = { id: 999, name: 'User Updated' };
            (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const response = await request(app)
                .put('/users/profile')
                .send({ name: 'User Updated' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedUser);
        });
    });

    describe('deleteProfile', () => {
        it('devrait supprimer le profil de l\'utilisateur', async () => {
            (userService.delete as jest.Mock);

            const response = await request(app).delete('/users/profile');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
        });
    });
});
