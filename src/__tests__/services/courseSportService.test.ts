import courseSportService from '../../services/courseSportService';
import courseSportRepository from '../../repositories/courseSportRepository';
import courseRepository from '../../repositories/courseRepository';
import sinon from 'sinon';

describe('CourseSportService', () => {
    let sandbox: sinon.SinonSandbox;
    let courseSportRepositoryMock: sinon.SinonMock;
    let courseRepositoryMock: sinon.SinonMock;

    beforeEach(() => {
        // Create a sandbox for this test
        sandbox = sinon.createSandbox();
        courseSportRepositoryMock = sandbox.mock(courseSportRepository);
        courseRepositoryMock = sandbox.mock(courseRepository);
    });

    afterEach(() => {
        // Restore the sandbox to its original state
        sandbox.restore();
    });

    describe('create', () => {
        it('should create a course\'s sport', async () => {
            const mockData = { courseId: 1, sportId: 2 };
            const mockCreatedCourseSport = { id: 1, ...mockData };

            courseSportRepositoryMock.expects('create').withArgs(mockData).resolves(mockCreatedCourseSport);

            const result = await courseSportService.create(mockData);

            expect(result).toEqual(mockCreatedCourseSport);
            courseSportRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a course\'s sport if more than one sport is associated with the course', async () => {
            const mockCourseSport = { id: 1, courseId: 1 };
            const mockCourse = { id: 1, Sports: [{ id: 1 }, { id: 2 }] };

            courseSportRepositoryMock.expects('getById').withArgs(1).resolves(mockCourseSport);
            courseRepositoryMock.expects('getById').withArgs(mockCourseSport.courseId).resolves(mockCourse);
            courseSportRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await courseSportService.delete(1);

            expect(result).toEqual({});
            courseSportRepositoryMock.verify();
            courseRepositoryMock.verify();
        });

        it('should throw an error if attempting to delete the only sport in a course', async () => {
            const mockCourseSport = { id: 1, courseId: 1 };
            const mockCourse = { id: 1, Sports: [{ id: 1 }] }; // Only one sport associated

            courseSportRepositoryMock.expects('getById').withArgs(1).resolves(mockCourseSport);
            courseRepositoryMock.expects('getById').withArgs(mockCourseSport.courseId).resolves(mockCourse);

            try {
                await courseSportService.delete(1);
                expect(true).toBe(false); // Should not reach here
            } catch (error) {
                expect(error.message).toEqual('CODE400: you cannot remove the only sport remaining in a course');
            }

            courseSportRepositoryMock.verify();
            courseRepositoryMock.verify();
        });
    });
});
