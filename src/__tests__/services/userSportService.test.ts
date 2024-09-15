import userSportService from '../../services/userSportService';
import userSportRepository from '../../repositories/userSportRepository';
import sinon from 'sinon';
import { Level } from '../../models/data';

describe('UserSportService', () => {
    let sandbox: sinon.SinonSandbox;
    let userSportRepositoryMock: sinon.SinonMock;

    beforeEach(() => {
        // Create a sandbox for this test
        sandbox = sinon.createSandbox();
        userSportRepositoryMock = sandbox.mock(userSportRepository);
    });

    afterEach(() => {
        // Restore the sandbox to its original state
        sandbox.restore();
    });

    describe('getById', () => {
        it('should fetch a user\'s sport by id', async () => {
            const mockSport = { id: 1, level: 'beginner' };

            userSportRepositoryMock.expects('getById').withArgs(1).resolves(mockSport);

            const result = await userSportService.getById(1);

            expect(result).toEqual(mockSport);
            userSportRepositoryMock.verify();
        });
    });

    describe('create', () => {
        it('should create a user\'s sport with a valid level', async () => {
            // Use a valid Level enum value
            const mockData = { userId: 1, sportId: 2, level: Level.Beginner };
            const mockCreatedSport = { id: 1, ...mockData };

            userSportRepositoryMock.expects('create').withArgs(mockData).resolves(mockCreatedSport);

            const result = await userSportService.create(mockData);

            expect(result).toEqual(mockCreatedSport);
            userSportRepositoryMock.verify();
        });

        it('should throw an error if level is invalid', async () => {
            const invalidData = { userId: 1, sportId: 2, level: 'invalid_level' };

            try {
                await userSportService.create(invalidData);
                // If it gets here, the test should fail
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toEqual('CODE400: user\'s sport\'s level attribute should be a level');
            }

            userSportRepositoryMock.verify();
        });
    });

    describe('update', () => {
        it('should update a user\'s sport with a valid level', async () => {
            const mockData = { level: 'advanced' };
            const mockUpdatedSport = { id: 1, ...mockData };

            userSportRepositoryMock.expects('update').withArgs(1, mockData).resolves(mockUpdatedSport);

            const result = await userSportService.update(1, mockData);

            expect(result).toEqual(mockUpdatedSport);
            userSportRepositoryMock.verify();
        });

        it('should throw an error if level is invalid', async () => {
            const invalidData = { level: 'invalid_level' };

            try {
                await userSportService.update(1, invalidData);
                // If it gets here, the test should fail
                expect(true).toBe(false);
            } catch (error: any) {
                expect(error.message).toEqual('CODE400: user\'s sport\'s level attribute should be a level');
            }

            userSportRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a user\'s sport by id', async () => {
            userSportRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await userSportService.delete(1);

            expect(result).toEqual({});
            userSportRepositoryMock.verify();
        });
    });
});
