import { Request } from "express";
import Course from "../../models/course";
import { Role } from "../../models/data";
import User from "../../models/user";
import { checkAttr, checkEmail, checkPassword, isAdmin, isCoach, checkCourseCoach, isAdminOrCourseOwner, isCourseOwner } from "../../utils/checks";

// Mock Course model
jest.mock('../../models/course', () => ({
    findByPk: jest.fn()
}));

describe('Utility Functions', () => {
    
    describe('checkAttr', () => {
        it('devrait lancer une erreur si un attribut requis est manquant', () => {
            const obj = { name: 'John' };
            expect(() => checkAttr(obj, 'user', ['name', 'email'])).toThrow('CODE400: Provided user data object misses the following attributes : email.');
        });

        // it('devrait supprimer les attributs interdits de l\'objet', () => {
        //     const obj = { name: 'John', password: '123456' };
        //     const result = checkAttr(obj, 'user', ['name'], ['password']);
        //     expect(result).toEqual({ name: 'John' });
        // });

        it('devrait retourner l\'objet intact si tous les attributs requis sont présents', () => {
            const obj = { name: 'John', email: 'john@example.com' };
            const result = checkAttr(obj, 'user', ['name', 'email']);
            expect(result).toEqual(obj);
        });
    });

    describe('checkEmail', () => {
        it('devrait lancer une erreur pour un e-mail invalide', () => {
            expect(() => checkEmail('invalid-email')).toThrow('CODE400: Invalid Email format');
        });

        it('devrait ne pas lancer d\'erreur pour un e-mail valide', () => {
            expect(() => checkEmail('test@example.com')).not.toThrow();
        });
    });

    describe('checkPassword', () => {
        it('devrait lancer une erreur si le mot de passe est trop court', () => {
            expect(() => checkPassword('short')).toThrow('CODE400: Password should be a string of 8 chars or more');
        });

        it('devrait ne pas lancer d\'erreur pour un mot de passe valide', () => {
            expect(() => checkPassword('validPassword')).not.toThrow();
        });
    });

    describe('isAdmin', () => {
        it('devrait retourner true si l\'utilisateur est un administrateur', () => {
            const user = { roles: [Role.Admin] };
            expect(isAdmin(user as unknown as User)).toBe(true);
        });

        it('devrait retourner false si l\'utilisateur n\'est pas un administrateur', () => {
            const user = { roles: [Role.User] };
            expect(isAdmin(user as unknown as User)).toBe(false);
        });
    });

    describe('isCoach', () => {
        it('devrait retourner true si l\'utilisateur est un coach', () => {
            const user = { roles: [Role.Coach] };
            expect(isCoach(user as unknown as User)).toBe(true);
        });

        it('devrait retourner false si l\'utilisateur n\'est pas un coach', () => {
            const user = { roles: [Role.User] };
            expect(isCoach(user as unknown as User)).toBe(false);
        });
    });

    // describe('checkCourseCoach', () => {
    //     it('devrait lancer une erreur si l\'utilisateur n\'est pas propriétaire du cours ou admin', async () => {
    //         const req = { params: { id: '1' }, user: { id: 2, roles: [Role.User] } } as unknown as Request;
    //         (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
    //         await expect(checkCourseCoach(req)).rejects.toThrow('CODE403: The user is not the owner of this course');
    //     });

    //     it('devrait ne pas lancer d\'erreur si l\'utilisateur est propriétaire du cours', async () => {
    //         const req = { params: { id: '1' }, user: { id: 1, roles: [Role.User] } } as unknown as Request;
    //         (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
    //         await expect(checkCourseCoach(req)).resolves.not.toThrow();
    //     });
    // });

    describe('isAdminOrCourseOwner', () => {
        it('devrait retourner true si l\'utilisateur est admin', async () => {
            const req = { user: { roles: [Role.Admin] } } as unknown as Request;
            expect(await isAdminOrCourseOwner(req)).toBe(true);
        });

        it('devrait retourner true si l\'utilisateur est propriétaire du cours', async () => {
            const req = { params: { id: '1' }, user: { id: 1, roles: [Role.User] } } as unknown as Request;
            (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
            expect(await isAdminOrCourseOwner(req)).toBe(true);
        });

        it('devrait retourner false si l\'utilisateur n\'est ni admin ni propriétaire du cours', async () => {
            const req = { params: { id: '1' }, user: { id: 2, roles: [Role.User] } } as unknown as Request;
            (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
            expect(await isAdminOrCourseOwner(req)).toBe(false);
        });
    });

    describe('isCourseOwner', () => {
        it('devrait retourner true si l\'utilisateur est propriétaire du cours', async () => {
            const req = { params: { id: '1' }, user: { id: 1 } } as unknown as Request;
            (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
            expect(await isCourseOwner(req)).toBe(true);
        });

        it('devrait retourner false si l\'utilisateur n\'est pas propriétaire du cours', async () => {
            const req = { params: { id: '1' }, user: { id: 2 } } as unknown as Request;
            (Course.findByPk as jest.Mock).mockResolvedValue({ dataValues: { ownerId: 1 } });
            expect(await isCourseOwner(req)).toBe(false);
        });
    });
});
