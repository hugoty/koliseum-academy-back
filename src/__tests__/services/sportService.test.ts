import sportService from '../../services/sportService';
import SportRepository from '../../repositories/sportRepository';
import sinon from 'sinon';

describe('SportService', () => {
    let sandbox: sinon.SinonSandbox;
    let sportRepositoryMock: sinon.SinonMock;

    beforeEach(() => {
        // Create a sandbox for this test
        sandbox = sinon.createSandbox();
        sportRepositoryMock = sandbox.mock(SportRepository);
    });

    afterEach(() => {
        // Restore the sandbox to its original state
        sandbox.restore();
    });

    describe('getAll', () => {
        it('should fetch all sports', async () => {
            const mockSports = [{ id: 1, name: 'Football' }, { id: 2, name: 'Basketball' }];

            sportRepositoryMock.expects('getAll').resolves(mockSports);

            const result = await sportService.getAll();

            expect(result).toEqual(mockSports);
            sportRepositoryMock.verify();
        });
    });

    describe('getById', () => {
        it('should fetch a sport by id', async () => {
            const mockSport = { id: 1, name: 'Football' };

            sportRepositoryMock.expects('getById').withArgs(1).resolves(mockSport);

            const result = await sportService.getById(1);

            expect(result).toEqual(mockSport);
            sportRepositoryMock.verify();
        });
    });

    describe('create', () => {
        it('should create a new sport', async () => {
            const mockData = { name: 'Volleyball' };
            const mockCreatedSport = { id: 1, ...mockData };

            sportRepositoryMock.expects('create').withArgs(mockData).resolves(mockCreatedSport);

            const result = await sportService.create(mockData);

            expect(result).toEqual(mockCreatedSport);
            sportRepositoryMock.verify();
        });
    });

    describe('update', () => {
        it('should update a sport', async () => {
            const mockData = { name: 'Updated Sport Name' };
            const mockUpdatedSport = { id: 1, ...mockData };

            sportRepositoryMock.expects('update').withArgs(1, mockData).resolves(mockUpdatedSport);

            const result = await sportService.update(1, mockData);

            expect(result).toEqual(mockUpdatedSport);
            sportRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a sport by id', async () => {
            sportRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await sportService.delete(1);

            expect(result).toEqual({});
            sportRepositoryMock.verify();
        });
    });
});
