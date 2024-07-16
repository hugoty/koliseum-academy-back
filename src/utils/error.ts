import { Request, Response } from "express";
import { checkAttr } from "./checks";

export function parseError(error: any) {
    let res = {
        code: 500,
        message: 'Unknown error'
    };
    if (error.message && typeof error.message === 'string') {
        const msg = error.message;
        if (msg.startsWith('CODE')) res = {
            code: parseInt(msg.substring(4, 7)),
            message: msg.substring(9)
        };
        else res.message = msg
    }
    return res
}

export async function genericController(req: Request, res: Response, core: (req: Request, res: Response) => any, checkId: boolean = true) {
    try {
        if (checkId) checkAttr(req.params, 'req.params', ['id']);
        await core(req, res);
    } catch (error: any) {
        const err = parseError(error);
        res.status(err.code).json({ error: err.message });
    }
}

export async function genericServRepo(name: string, message: string, args: any[], fn: (...params: any[]) => any): Promise<any> {
    try {
        return await fn(...args);
    } catch (error: any) {
        console.log(`${name} : ${error.message || 'unknown error'}`, error);
        throw new Error(error.message.startsWith('CODE') ? error.message : message);
    }
}