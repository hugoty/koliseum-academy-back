import DOMPurify from 'dompurify';
import express from 'express';
import { JSDOM } from 'jsdom';

// Initialisation de DOMPurify avec jsdom
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Middleware pour assainir les entrées utilisateur
const sanitizeInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Fonction récursive pour assainir les objets imbriqués
    const sanitize = (data: any): any => {
        if (typeof data === 'string') {
            return purify.sanitize(data); // Appliquer DOMPurify aux chaînes
        }
        if (typeof data === 'object' && data !== null) {
            for (let key in data) {
                data[key] = sanitize(data[key]);  // Appliquer récursivement aux objets
            }
        }
        return data;
    };

    // Assainir req.body, req.query, et req.params
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};

export default sanitizeInput;
