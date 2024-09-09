// /src/tests/userController.test.ts
import { Request, Response } from 'express';
import userController from '../controllers/userController';
import userService from '../services/userService';
import { isAdmin } from '../utils/checks';

// Mock du service userService
jest.mock('../services/userService');

// Mock de la fonction isAdmin
jest.mock('../utils/checks', () => ({
    isAdmin: jest.fn(),
}));

// Fonctions utilitaires pour mocker req et res
const mockRequest = (params = {}, body = {}, user = {}) => ({
    params,
    body,
    user,
} as Partial<Request>);

const mockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
};

describe('UserController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
            (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

            await userController.getAll(req as Request, res as Response);

            expect(userService.getAll).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe('searchCoaches', () => {
        it('should return coaches based on body criteria', async () => {
            const mockCoaches = [{ id: 1, name: 'Coach A' }, { id: 2, name: 'Coach B' }];
            req.body = { criteria: 'some criteria' };
            (userService.searchCoaches as jest.Mock).mockResolvedValue(mockCoaches);

            await userController.searchCoaches(req as Request, res as Response);

            expect(userService.searchCoaches).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockCoaches);
        });
    });

    describe('create', () => {
        it('should create a new user and return 201', async () => {
            const newUser = { id: 1, name: 'New User' };
            req.body = { name: 'New User' };
            (userService.create as jest.Mock).mockResolvedValue(newUser);

            await userController.create(req as Request, res as Response);

            expect(userService.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });
    });

    describe('getById', () => {
        it('should return user by id', async () => {
            const mockUser = { id: 1, name: 'User 1' };
            req.params = { id: '1' };
            (userService.getById as jest.Mock).mockResolvedValue(mockUser);
            (isAdmin as jest.Mock).mockReturnValue(false);

            await userController.getById(req as Request, res as Response);

            expect(userService.getById).toHaveBeenCalledWith(1, true);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('getProfile', () => {
        it('should return the profile of the logged-in user', async () => {
            const mockUser = { id: 1, name: 'User 1' };
            (req as any).user = { id: 1 };
            (userService.getById as jest.Mock).mockResolvedValue(mockUser);

            await userController.getProfile(req as Request, res as Response);

            expect(userService.getById).toHaveBeenCalledWith(1, false);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('grantCoachRole', () => {
        it('should grant coach role if user is admin', async () => {
            req.params = { id: '1' };
            (req as any).user = { roles: ['Admin'] };
            (isAdmin as jest.Mock).mockReturnValue(true);

            await userController.grantCoachRole(req as Request, res as Response);

            expect(userService.grantCoachRole).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ message: 'Coach role granted successfully' });
        });

        it('should return 403 if user is not admin', async () => {
            req.params = { id: '1' };
            (req as any).user = { roles: ['User'] };
            (isAdmin as jest.Mock).mockReturnValue(false);

            await userController.grantCoachRole(req as Request, res as Response);

            expect(userService.grantCoachRole).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Access to this user denied' });
        });
    });

    describe('revokeCoachRole', () => {
        it('should revoke coach role if user is admin', async () => {
            req.params = { id: '1' };
            (req as any).user = { roles: ['Admin'] };
            (isAdmin as jest.Mock).mockReturnValue(true);

            await userController.revokeCoachRole(req as Request, res as Response);

            expect(userService.revokeCoachRole).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ message: 'Coach role revoked successfully' });
        });

        it('should return 403 if user is not admin', async () => {
            req.params = { id: '1' };
            (req as any).user = { roles: ['User'] };
            (isAdmin as jest.Mock).mockReturnValue(false);

            await userController.revokeCoachRole(req as Request, res as Response);

            expect(userService.revokeCoachRole).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Access to this user denied' });
        });
    });

    describe('update', () => {
        it('should update user by id', async () => {
            const updatedUser = { id: 1, name: 'Updated User' };
            req.params = { id: '1' };
            req.body = { name: 'Updated User' };
            (userService.update as jest.Mock).mockResolvedValue(updatedUser);

            await userController.update(req as Request, res as Response);

            expect(userService.update).toHaveBeenCalledWith(1, req.body);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });
    });

    describe('updateProfile', () => {
        it('should update the profile of the logged-in user', async () => {
            const updatedUser = { id: 1, name: 'Updated User' };
            (req as any).user = { id: 1 };
            req.body = { name: 'Updated User' };
            (userService.update as jest.Mock).mockResolvedValue(updatedUser);

            await userController.updateProfile(req as Request, res as Response);

            expect(userService.update).toHaveBeenCalledWith(1, req.body);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });
    });

    describe('delete', () => {
        it('should delete user by id', async () => {
            req.params = { id: '1' };

            await userController.delete(req as Request, res as Response);

            expect(userService.delete).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    });

    describe('deleteProfile', () => {
        it('should delete the profile of the logged-in user', async () => {
            (req as any).user = { id: 1 };

            await userController.deleteProfile(req as Request, res as Response);

            expect(userService.delete).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    });
});
