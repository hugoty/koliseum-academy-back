import { Request, Response } from "express";
import { parseError, genericController, genericServRepo } from "../../utils/error";
import { checkAttr } from "../../utils/checks";
import Course from "../../models/course";
import { Role } from "../../models/data";

// Mock Response Object
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Mock Course model
jest.mock('../../models/course', () => ({
    findByPk: jest.fn()
}));

describe('Utility Functions', () => {
    
    // Tests pour parseError
    describe('parseError', () => {
        it('devrait retourner un objet d\'erreur par défaut pour une erreur sans message', () => {
            const error = {};
            const result = parseError(error);
            expect(result).toEqual({ code: 500, message: 'Unknown error' });
        });

        it('devrait retourner un objet d\'erreur avec le code et le message fournis', () => {
            const error = new Error('CODE404: Resource not found');
            const result = parseError(error);
            expect(result).toEqual({ code: 404, message: 'Resource not found' });
        });

        it('devrait retourner un objet d\'erreur avec un message personnalisé', () => {
            const error = new Error('Custom error message');
            const result = parseError(error);
            expect(result).toEqual({ code: 500, message: 'Custom error message' });
        });
    });

    // Tests pour genericController
    describe('genericController', () => {
        let req: Partial<Request>;
        let res: Response;

        beforeEach(() => {
            req = { params: { id: '1' } };
            res = mockResponse();
        });

        it('devrait appeler la fonction contrôleur de base', async () => {
            const core = jest.fn().mockResolvedValue({});
            await genericController(req as Request, res, core);
            expect(core).toHaveBeenCalledWith(req, res);
        });

        it('devrait gérer les erreurs et renvoyer le bon code de statut', async () => {
            const error = new Error('CODE400: Bad Request');
            const core = jest.fn().mockRejectedValue(error);

            await genericController(req as Request, res, core);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request' });
        });

        it('devrait vérifier l\'id dans req.params si checkId est vrai', async () => {
            const core = jest.fn();
            req.params = {}; // Pas d'id fourni

            await genericController(req as Request, res, core);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Provided req.params data object misses the following attributes : id.'
            });
        });
    });

    // Tests pour genericServRepo
    describe('genericServRepo', () => {
        it('devrait exécuter et retourner le résultat de la fonction fournie', async () => {
            const mockFn = jest.fn().mockResolvedValue('success');
            const result = await genericServRepo('testRepo', 'Error occurred', [], mockFn);
            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalled();
        });

        it('devrait lancer une erreur avec un message personnalisé si une erreur se produit', async () => {
            const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));
            await expect(genericServRepo('testRepo', 'Error occurred', [], mockFn))
                .rejects
                .toThrow('Error occurred');
        });

        it('devrait lancer une erreur avec le message d\'erreur du code si un message CODE est présent', async () => {
            const mockFn = jest.fn().mockRejectedValue(new Error('CODE500: Internal Server Error'));
            await expect(genericServRepo('testRepo', 'Error occurred', [], mockFn))
                .rejects
                .toThrow('Internal Server Error');
        });
    });
});
