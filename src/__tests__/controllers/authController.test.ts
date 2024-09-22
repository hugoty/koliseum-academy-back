import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authController from '../../controllers/authController';
import User from '../../models/user';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models/user');

const app = express();
app.use(express.json());
app.post('/auth/login', authController.login);

describe('AuthController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('devrait retourner un token pour des identifiants valides', async () => {
        const mockUser = { id: 1, email: 'test@example.com', passwordHash: 'hashedPassword' };
        const mockToken = 'mockedToken';

        // Mocker les méthodes
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe(mockToken);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.passwordHash);
    });

    it('devrait retourner une erreur 401 pour des identifiants invalides', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null); // Aucun utilisateur trouvé

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });

    it('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error.');
    });
});
