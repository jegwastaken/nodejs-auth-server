import {genSalt, hash} from 'bcrypt';
import {RequestHandler} from 'express';
import User from '../models/user';

import {
    getValidationErrors,
    validateEmail,
    validatePassword,
    validateUsername,
} from '../helpers/errors';

export const addUser: RequestHandler[] = [
    validateUsername('new-username'),
    validateEmail('new-email'),
    validatePassword('new-password'),
    async(req, res, next) => {
        getValidationErrors(req, next);

        const salt = await genSalt();
        const hashed = await hash(req.body['new-password'], salt);

        const user = new User({
            username: req.body['new-username'],
            email: req.body['new-email'],
            password: hashed,
        });

        return user
            .save()
            .then((addedUser) => res.send(addedUser))
            .catch((userSaveErr) => next(userSaveErr));
    },
];
