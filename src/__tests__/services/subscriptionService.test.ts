import subscriptionService from '../../services/subscriptionService';
import subscriptionRepository from '../../repositories/subscriptionRepository';
import courseRepository from '../../repositories/courseRepository';
import userService from '../../services/userService';
import courseService from '../../services/courseService';
import { RequestStatus } from '../../models/data';
import sinon from 'sinon';

describe('SubscriptionService', () => {
    let sandbox: sinon.SinonSandbox;
    let subscriptionRepositoryMock: sinon.SinonMock;
    let courseRepositoryMock: sinon.SinonMock;
    let userServiceMock: sinon.SinonMock;
    let courseServiceMock: sinon.SinonMock;

    beforeEach(() => {
        // Create a sandbox for this test
        sandbox = sinon.createSandbox();
        subscriptionRepositoryMock = sandbox.mock(subscriptionRepository);
        courseRepositoryMock = sandbox.mock(courseRepository);
        userServiceMock = sandbox.mock(userService);
        courseServiceMock = sandbox.mock(courseService);
    });

    afterEach(() => {
        // Restore the sandbox to its original state
        sandbox.restore();
    });

    describe('getAll', () => {
        it('should fetch all subscriptions', async () => {
            const mockSubscriptions = [{ id: 1 }, { id: 2 }];

            subscriptionRepositoryMock.expects('getAll').resolves(mockSubscriptions);

            const result = await subscriptionService.getAll();

            expect(result).toEqual(mockSubscriptions);
            subscriptionRepositoryMock.verify();
        });
    });

    describe('create', () => {
        it('should create a subscription with available course places', async () => {
            const mockData = { courseId: 1, userId: 1 };
            const mockCourse = { id: 1, remainingPlaces: 5 };
            const mockCreatedSubscription = { id: 1, ...mockData };

            courseRepositoryMock.expects('getById').withArgs(mockData.courseId).resolves(mockCourse);
            subscriptionRepositoryMock.expects('create').withArgs(mockData).resolves(mockCreatedSubscription);

            const result = await subscriptionService.create(mockData);

            expect(result).toEqual(mockCreatedSubscription);
            courseRepositoryMock.verify();
            subscriptionRepositoryMock.verify();
        });

        it('should throw an error if there are no remaining places', async () => {
            const mockData = { courseId: 1, userId: 1 };
            const mockCourse = { id: 1, remainingPlaces: 0 };

            courseRepositoryMock.expects('getById').withArgs(mockData.courseId).resolves(mockCourse);

            try {
                await subscriptionService.create(mockData);
                expect(true).toBe(false); // Should not reach here
            } catch (error) {
                expect(error.message).toEqual('CODE400: no remaining places in this course');
            }

            courseRepositoryMock.verify();
        });
    });

    describe('getById', () => {
        it('should fetch a subscription by id with user and course details', async () => {
            const mockSubscription = { id: 1, userId: 1, courseId: 1, dataValues: {} };
            const mockUser = { id: 1, name: 'John Doe' };
            const mockCourse = { id: 1, title: 'Course Title' };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            userServiceMock.expects('getById').withArgs(mockSubscription.userId).resolves(mockUser);
            courseServiceMock.expects('getById').withArgs(mockSubscription.courseId).resolves(mockCourse);

            const result = await subscriptionService.getById(1);

            expect(result.dataValues.user).toEqual(mockUser);
            expect(result.dataValues.course).toEqual(mockCourse);
            subscriptionRepositoryMock.verify();
            userServiceMock.verify();
            courseServiceMock.verify();
        });
    });

    describe('accept', () => {
        it('should accept a subscription and decrease the remaining places', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Pending, courseId: 1 };
            const mockCourse = { id: 1, remainingPlaces: 5 };
            const updatedSubscription = { ...mockSubscription, status: RequestStatus.Accepted };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            courseRepositoryMock.expects('getById').withArgs(mockSubscription.courseId).resolves(mockCourse);
            subscriptionRepositoryMock.expects('update').withArgs(1, { status: RequestStatus.Accepted }).resolves(updatedSubscription);
            courseRepositoryMock.expects('update').withArgs(mockSubscription.courseId, { remainingPlaces: 4 }).resolves({});

            const result = await subscriptionService.accept(1);

            expect(result).toEqual(updatedSubscription);
            subscriptionRepositoryMock.verify();
            courseRepositoryMock.verify();
        });

        it('should throw an error if subscription is canceled', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Canceled, courseId: 1 };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);

            try {
                await subscriptionService.accept(1);
                expect(true).toBe(false); // Should not reach here
            } catch (error: any) {
                expect(error.message).toEqual('Error accepting subscription');
            }

            subscriptionRepositoryMock.verify();
        });

        it('should throw an error if there are no remaining places', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Pending, courseId: 1 };
            const mockCourse = { id: 1, remainingPlaces: 0 };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            courseRepositoryMock.expects('getById').withArgs(mockSubscription.courseId).resolves(mockCourse);

            try {
                await subscriptionService.accept(1);
                expect(true).toBe(false); // Should not reach here
            } catch (error) {
                expect(error.message).toEqual('CODE400: no remaining places in this course');
            }

            subscriptionRepositoryMock.verify();
            courseRepositoryMock.verify();
        });
    });

    describe('reject', () => {
        it('should reject a subscription', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Pending };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            subscriptionRepositoryMock.expects('update').withArgs(1, { status: RequestStatus.Rejected }).resolves({ ...mockSubscription, status: RequestStatus.Rejected });

            const result = await subscriptionService.reject(1);

            expect(result.status).toEqual(RequestStatus.Rejected);
            subscriptionRepositoryMock.verify();
        });

        it('should throw an error if subscription is canceled', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Canceled };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);

            try {
                await subscriptionService.reject(1);
                expect(true).toBe(false); // Should not reach here
            } catch (error: any) {
                expect(error.message).toEqual('Error rejecting subscription');
            }

            subscriptionRepositoryMock.verify();
        });
    });

    describe('cancel', () => {
        it('should cancel an accepted subscription and increase remaining places', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Accepted, courseId: 1 };
            const mockCourse = { id: 1, remainingPlaces: 5 };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            subscriptionRepositoryMock.expects('delete').withArgs(1).resolves({});
            courseRepositoryMock.expects('getById').withArgs(mockSubscription.courseId).resolves(mockCourse);
            courseRepositoryMock.expects('update').withArgs(mockSubscription.courseId, { remainingPlaces: 6 }).resolves({});

            const result = await subscriptionService.cancel(1);

            expect(result).toEqual({ message: "Subscription deleted successfully" });
            subscriptionRepositoryMock.verify();
            courseRepositoryMock.verify();
        });

        it('should cancel a non-accepted subscription without altering course places', async () => {
            const mockSubscription = { id: 1, status: RequestStatus.Pending, courseId: 1 };

            subscriptionRepositoryMock.expects('getById').withArgs(1).resolves(mockSubscription);
            subscriptionRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await subscriptionService.cancel(1);

            expect(result).toEqual({ message: "Subscription deleted successfully" });
            subscriptionRepositoryMock.verify();
        });
    });

    describe('update', () => {
        it('should update a subscription', async () => {
            const mockData = { status: RequestStatus.Accepted };
            const mockUpdatedSubscription = { id: 1, ...mockData };

            subscriptionRepositoryMock.expects('update').withArgs(1, mockData).resolves(mockUpdatedSubscription);

            const result = await subscriptionService.update(1, mockData);

            expect(result).toEqual(mockUpdatedSubscription);
            subscriptionRepositoryMock.verify();
        });
    });

    describe('delete', () => {
        it('should delete a subscription', async () => {
            subscriptionRepositoryMock.expects('delete').withArgs(1).resolves({});

            const result = await subscriptionService.delete(1);

            expect(result).toEqual({});
            subscriptionRepositoryMock.verify();
        });
    });
});
