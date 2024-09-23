import request from 'supertest';
import express from 'express';
import courseSportController from '../../controllers/courseSportController';
import courseSportService from '../../services/courseSportService';
import { checkCourseCoach } from '../../utils/checks';

jest.mock('../../services/courseSportService');
jest.mock('../../utils/checks');

const app = express();
app.use(express.json());
app.post('/courses/:id/sport/:sportId', courseSportController.create);
app.delete('/courses/sport/:id', courseSportController.delete);

describe('CourseSportController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('create', () => {
        it('devrait ajouter un sport à un cours', async () => {
            const mockCourseSport = { courseId: 1, sportId: 2 };
            (courseSportService.create as jest.Mock).mockResolvedValue(mockCourseSport);
            (checkCourseCoach as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/courses/1/sport/2')
                .set('Authorization', 'Bearer mocktoken'); // Simulate auth

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockCourseSport);
            expect(courseSportService.create).toHaveBeenCalledWith({ courseId: 1, sportId: 2 });
        });
    });

    describe('delete', () => {
        it('devrait supprimer un sport d\'un cours', async () => {
            (courseSportService.delete as jest.Mock);
            (checkCourseCoach as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete('/courses/sport/1')
                .set('Authorization', 'Bearer mocktoken'); // Simulate auth

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Course\'s sport deleted successfully' });
            expect(courseSportService.delete).toHaveBeenCalledWith(1);
        });
    });
});
