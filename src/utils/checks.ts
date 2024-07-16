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