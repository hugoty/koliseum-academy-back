import courseService from '../../services/courseService';
import courseRepository from '../../repositories/courseRepository';
import courseSportRepository from '../../repositories/courseSportRepository';
import sportRepository from '../../repositories/sportRepository';
import userRepository from '../../repositories/userRepository';
import userService from '../../services/userService';
import { Level } from '../../models/data';
import sinon from 'sinon';

describe('CourseService', () => {
    let sandbox: sinon.SinonSandbox;
    let courseRepositoryMock: sinon.SinonMock;
    let courseSportRepositoryMock: sinon.SinonMock;
    let sportRepositoryMock: sinon.SinonMock;
    let userRepositoryMock: sinon.SinonMock;
    let userServiceMock: sinon.SinonMock;

    beforeEach(() => {
        // Create a sandbox for this test
        sandbox = sinon.createSandbox();
        courseRepositoryMock = sandbox.mock(courseRepository);
        courseSportRepositoryMock = sandbox.mock(courseSportRepository);
        sportRepositoryMock = sandbox.mock(sportRepository);
        userRepositoryMock = sandbox.mock(userRepository);
        userServiceMock = sandbox.mock(userService);
    });

    afterEach(() => {
        // Restore the sandbox to its original state
        sandbox.restore();
    });

    describe('create', () => {
        it('should create a course with valid data', async () => {
            const mockData = {
                levels: [Level.Beginner],
                sportIds: [1],
                locations: ['Location A'],
                places: 10,
                remainingPlaces: 5
            };
            const mockCreatedCourse = { id: 1, ...mockData };
            const mockSport = { id: 1, name: 'Sport 1' };

            sportRepositoryMock.expects('getById').withArgs(1).resolves(mockSport);
            courseRepositoryMock.expects('create').withArgs(mockData).resolves(mockCreatedCourse);
            courseSportRepositoryMock.expects('create').withArgs({ courseId: 1, sportId: 1 }).resolves({});

            const result = await courseService.create(mockData);

            expect(result).toEqual(mockCreatedCourse);
            sportRepositoryMock.verify();
            courseRepositoryMock.verify();
            courseSportRepositoryMock.verify();
        });

        it('should throw an error if a sport ID is not found', async () => {
            const mockData = {
                levels: [Level.Beginner],
                sportIds: [999],
                locations: ['Location A'],
                places: 10,
                remainingPlaces: 5
            };

            sportRepositoryMock.expects('getById').withArgs(999).rejects(new Error('Sport not found'));

            try {
                await courseService.create(mockData);
                expect(true).toBe(false); // Should not reach here
            } catch (error) {
                expect(error.message).toEqual('CODE400: sport id 999 not found');
            }

            sportRepositoryMock.verify();
        });
    });

    describe('searchCourses', () => {
        it('should search for courses by coach name and levels', async () => {
            const mockData = {
                coachName: 'John Doe',
                levels: [Level.Beginner]
            };
            const mockCoaches = [{ id: 1, name: 'John Doe' }];
            const mockCourses = [{ id: 1, name: 'Course 1', ownerId: 1, dataValues: {} }];
            const mockOwner = { id: 1, name: 'John Doe' };

            userRepositoryMock.expects('searchCoaches').withArgs({ name: 'John Doe' }).resolves(mockCoaches);
            courseRepositoryMock.expects('searchCourses').withArgs({ ...mockData, coachIds: [1] }).resolves(mockCourses);
            userServiceMock.expects('getById').withArgs(1).resolves(mockOwner);

            const result = await courseService.searchCourses(mockData);

            expect(result[0].dataValues.owner).toEqual(mockOwner);
            userRepositoryMock.verify();
            courseRepositoryMock.verify();
            userServiceMock.verify();
        });
    });

    describe('getById', () => {
        it('should fetch a course by id with public information', async () => {
            const mockCourse = { id: 1, name: 'Course 1', ownerId: 1, dataValues: {} };
            const mockOwner = { id: 1, name: 'John Doe' };

            courseRepositoryMock.expects('getById').withArgs(1).resolves(mockCourse);
            userServiceMock.expects('getById').withArgs(1).resolves(mockOwner);

            const result = await courseService.getById(1);

            expect(result.dataValues.owner).toEqual(mockOwner);
            courseRepositoryMock.verify();
            userServiceMock.verify();
        });
    });

    describe('update', () => {
        it('should update a course with new data', async () => {
            const mockData = { levels: [Level.Advanced], sportIds: [2] };
            const mockCourse = {
                id: 1,
                name: 'Course 1',
                places: 10,
                Sports: [{ id: 1, CourseSport: { id: 101 } }] // Adjusted structure to include CourseSport with id
            };
            const mockUpdatedCourse = { id: 1, ...mockData };

            // Expectations for the repositories
            courseRepositoryMock.expects('getById').withArgs(1).resolves(mockCourse);
            sportRepositoryMock.expects('getById').withArgs(2).resolves({ id: 2, name: 'Sport 2' });
            courseSportRepositoryMock.expects('create').withArgs({ courseId: 1, sportId: 2 }).resolves({});
            courseSportRepositoryMock.expects('delete').withArgs(101).resolves({}); // Using CourseSport.id for deletion
            courseRepositoryMock.expects('update').withArgs(1, mockData).resolves(mockUpdatedCourse);

            // Run the update method
            const result = await courseService.update(1, mockData);

            // Assertions
            expect(result).toEqual(mockUpdatedCourse);

            // Verify the mocks
            courseRepositoryMock.verify();
            courseSportRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a course by id', async () => {
            courseRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await courseService.delete(1);

            expect(result).toEqual({ message: "Course deleted successfully" });
            courseRepositoryMock.verify();
        });
    });
});
