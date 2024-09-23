import request from 'supertest';
import express from 'express';
import courseController from '../../controllers/courseController';
import courseService from '../../services/courseService';
import { checkCourseCoach, isAdminOrCourseOwner } from '../../utils/checks';

jest.mock('../../services/courseService');
jest.mock('../../utils/checks');

const app = express();
app.use(express.json());
app.post('/courses', courseController.create);
app.post('/courses/search', courseController.searchCourses);
app.get('/courses/:id', courseController.getById);
app.put('/courses/:id', courseController.update);
app.delete('/courses/:id', courseController.delete);

describe('CourseController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    // describe('create', () => {
    //     it('devrait créer un nouveau cours', async () => {
    //         const mockCourse = { id: 1, name: 'Course 1' };
    //         (courseService.create as jest.Mock).mockResolvedValue(mockCourse);

    //         const response = await request(app)
    //             .post('/courses')
    //             .send({ name: 'Course 1' })
    //             .set('Authorization', 'Bearer mocktoken'); // Simulate auth

    //         expect(response.status).toBe(201);
    //         expect(response.body).toEqual(mockCourse);
    //         expect(courseService.create).toHaveBeenCalledWith({ name: 'Course 1', ownerId: undefined });
    //     });
    // });

    describe('searchCourses', () => {
        it('devrait rechercher des cours', async () => {
            const mockCourses = [{ id: 1, name: 'Course 1' }];
            (courseService.searchCourses as jest.Mock).mockResolvedValue(mockCourses);

            const response = await request(app)
                .post('/courses/search')
                .send({ keyword: 'Course' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCourses);
            expect(courseService.searchCourses).toHaveBeenCalledWith({ keyword: 'Course' });
        });
    });

    describe('getById', () => {
        it('devrait retourner un cours par ID', async () => {
            const mockCourse = { id: 1, name: 'Course 1' };
            (courseService.getById as jest.Mock).mockResolvedValue(mockCourse);
            (isAdminOrCourseOwner as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .get('/courses/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCourse);
            expect(courseService.getById).toHaveBeenCalledWith(1, false);
        });

        it('devrait retourner une erreur 404 si le cours n\'existe pas', async () => {
            (courseService.getById as jest.Mock).mockResolvedValue(null);
            (isAdminOrCourseOwner as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .get('/courses/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Course not found' });
        });
    });

    describe('update', () => {
        it('devrait mettre à jour un cours', async () => {
            const mockUpdatedCourse = { id: 1, name: 'Updated Course' };
            (courseService.update as jest.Mock).mockResolvedValue(mockUpdatedCourse);
            (checkCourseCoach as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .put('/courses/1')
                .send({ name: 'Updated Course' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedCourse);
            expect(courseService.update).toHaveBeenCalledWith(1, { name: 'Updated Course' });
        });
    });

    describe('delete', () => {
        it('devrait supprimer un cours', async () => {
            (courseService.delete as jest.Mock);
            (checkCourseCoach as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete('/courses/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Course deleted successfully' });
            expect(courseService.delete).toHaveBeenCalledWith(1);
        });
    });
});
