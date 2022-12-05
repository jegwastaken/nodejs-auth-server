import {genSalt, hash} from 'bcrypt';
import {RequestHandler} from 'express';
import Client from '../models/client';

import {
    errorFormatter,
    validateClientID,
    getValidationErrors,
} from '../helpers/errors';
import {body} from 'express-validator';

export const addClient: RequestHandler[] = [
    validateClientID('new-clientid'),
    body('new-clientname').isLength({min: 4, max: 20}),
    body('new-clientsecret').isStrongPassword(),
    body('new-redirectURI').isURL({require_tld: false}),
    async(req, res, next) => {
        if(!req.user) return next(errorFormatter('Not logged in', 401));

        getValidationErrors(req, next);

        const salt = await genSalt();
        const hashed = await hash(req.body['new-clientsecret'], salt);

        const client = new Client({
            userID: req.user.id,
            redirectURI: req.body['new-redirectURI'],
            clientID: req.body['new-clientid'],
            clientname: req.body['new-clientname'],
            clientsecret: hashed,
        });

        return client
            .save()
            .then((addedClient) => res.send(addedClient))
            .catch((clientSaveErr) => next(clientSaveErr));
    },
];
