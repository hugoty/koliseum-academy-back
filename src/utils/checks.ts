import { Request } from "express";
import Course from "../models/course";
import { Role } from "../models/data";
import User from "../models/user";


export function checkAttr(obj: any, errorKey: string, required: string[], forbidden: string[] = []) {
    if (!obj || typeof obj !== 'object') throw new Error('removeAttributes : argument 0 should be an object.');
    forbidden.forEach(attr => {
        if (attr in obj && ![null, undefined].includes(obj[attr])) delete obj.attr;
    })
    if (required.length > 0) {
        const missing: string[] = [];
        required.forEach(attr => {
            if (!(attr in obj) || [null, undefined].includes(obj[attr])) missing.push(attr);
        });
        if (missing.length > 0) throw new Error(`CODE400: Provided ${errorKey} data object misses the following attributes : ${missing.join(', ')}.`);
    }
    return obj;
}

export function checkEmail(email: string) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) throw new Error('Invalid Email format');
}

export function isAdmin(user: User) { return user.roles?.includes(Role.Admin); }

export function isCoach(user: User) { return user.roles?.includes(Role.Coach); }

export async function checkCourseCoach(req: Request) {
    if (!isAdminOrCourseOwner(req)) throw new Error('CODE403: The user is not the owner of this course');
}

export async function isAdminOrCourseOwner(req: Request) {
    if (!('user' in req)) return false;
    if (isAdmin((req as any).user)) return true;
    return await isCourseOwner(req);
}

export async function isCourseOwner(req: Request) {
    const user = (req as any).user;
    const courseId = Number(req.params.id);
    const course = await Course.findByPk(courseId);
    return course && user.id === course.dataValues.ownerId
}