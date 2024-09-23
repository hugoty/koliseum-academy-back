// Corrected instantiation of UserService
import userRepository from '../../repositories/userRepository';
import * as bcrypt from 'bcrypt';
import sinon from 'sinon';
import userService from '../../services/userService';
import courseRepository from '../../repositories/courseRepository';
import { Role } from '../../models/data';

describe('UserService', () => {
    let userRepositoryMock: sinon.SinonMock;
    let courseRepositoryMock: sinon.SinonMock;

    beforeEach(() => {
        userRepositoryMock = sinon.mock(userRepository);
        courseRepositoryMock = sinon.mock(courseRepository);
    });

    afterEach(() => {
        userRepositoryMock.restore();
        courseRepositoryMock.restore();
        sinon.restore();
    });

    describe('getAll', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: 1, email: 'test@example.com' }];
            userRepositoryMock.expects('getAll').resolves(mockUsers);

            const users = await userService.getAll();

            expect(users).toEqual(mockUsers);
            userRepositoryMock.verify();
        });
    });

    describe('searchCoaches', () => {
        it('should return coaches with their courses', async () => {
            const mockCoaches = [
                { id: 1, dataValues: { id: 1, email: 'coach1@example.com' } }
            ];
            const mockCourses = [{ id: 1, name: 'Course 1' }];

            userRepositoryMock.expects('searchCoaches').resolves(mockCoaches);
            courseRepositoryMock.expects('getCoachCourses').resolves(mockCourses);

            const data = { sports: [1] }; // Example data
            const coaches = await userService.searchCoaches(data);

            expect(coaches[0].ownedCourses).toEqual(mockCourses);
            userRepositoryMock.verify();
            courseRepositoryMock.verify();
        });
    });

    describe('create', () => {
        let sandbox: sinon.SinonSandbox;
        let userRepositoryMock: sinon.SinonMock;

        beforeEach(() => {
            // Create a sandbox for this test
            sandbox = sinon.createSandbox();
            userRepositoryMock = sandbox.mock(userRepository);
        });

        afterEach(() => {
            // Restore the sandbox to its original state
            sandbox.restore();
        });

        it('should create a new user with mocked password hash', async () => {
            const mockUser = { email: 'test@example.com', password: 'password123' };
            const mockCreatedUser = { id: 1, email: 'test@example.com' };

            // Mock userRepository functions
            userRepositoryMock.expects('getByEmail').withArgs(mockUser.email).resolves(null);
            userRepositoryMock.expects('create').withArgs(sinon.match({
                email: mockUser.email,
                passwordHash: sinon.match.string, // Just ensure passwordHash is a string
                salt: sinon.match.string // Ensure salt is a string
            })).resolves(mockCreatedUser);

            // Run the create method
            const user = await userService.create(mockUser);

            // Assertions
            expect(user).toEqual(mockCreatedUser);

            // Verify the repository methods were called
            userRepositoryMock.verify();
        });
    });

    describe('getById', () => {
        it('should return user by id with public profile', async () => {
            const mockUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                dataValues: { id: 1, firstName: 'John', lastName: 'Doe' },
                roles: [],
                Sports: []
            };

            userRepositoryMock.expects('getById').resolves(mockUser);

            const user = await userService.getById(1, true);

            expect(user).toEqual({
                id: mockUser.id,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
            });

            userRepositoryMock.verify();
        });
    });

    describe('grantCoachRole', () => {
        it('should grant the coach role to a user', async () => {
            const mockUser = {
                id: 1,
                roles: [],
            };

            userRepositoryMock.expects('getById').resolves(mockUser);
            userRepositoryMock.expects('update').resolves({});

            const result = await userService.grantCoachRole(1);

            expect(result).toEqual({ message: "User deleted successfully" });
            userRepositoryMock.verify();
        });
    });

    describe('revokeCoachRole', () => {
        it('should revoke the coach role from a user', async () => {
            const mockUser = {
                id: 1,
                roles: [Role.Coach], // Use the Role enum or exact string if that's what's used in the implementation
            };

            userRepositoryMock.expects('getById').resolves(mockUser);
            userRepositoryMock.expects('update').resolves({});

            const result = await userService.revokeCoachRole(1);

            expect(result).toEqual({ message: "User deleted successfully" });
            userRepositoryMock.verify();
        });
    });

    describe('update', () => {
        it('should update user data', async () => {
            const mockUser = { id: 1, email: 'updated@example.com' };
            const mockUpdatedUser = { id: 1, email: 'updated@example.com' };

            userRepositoryMock.expects('update').resolves(mockUpdatedUser);

            const updatedUser = await userService.update(1, mockUser);

            expect(updatedUser).toEqual(mockUpdatedUser);
            userRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a user by id', async () => {
            userRepositoryMock.expects('delete').resolves({});

            const result = await userService.delete(1);

            expect(result).toEqual({ message: "User deleted successfully" });
            userRepositoryMock.verify();
        });
    });
});