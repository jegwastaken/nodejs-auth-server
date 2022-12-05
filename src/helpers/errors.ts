import {NextFunction, Request} from 'express';

import {
    body,
    ValidationChain,
    ValidationError,
    validationResult,
} from 'express-validator';

import User from '../models/user';
import Client from '../models/client';

export const errorFormatter = (message = 'An error occured', status = 400) => ({
    status,
    errors: [{message}],
});

export const validationErrorFormatter = ({
    msg,
    param,
    value,
}: ValidationError) => ({
    message: msg,
    value,
    parameter: param,
});

// eslint-disable-next-line consistent-return
export const getValidationErrors = (req: Request, next: NextFunction) => {
    const errors = validationResult(req).formatWith(validationErrorFormatter);

    if(!errors.isEmpty()) {
        return next({
            status: 400,
            errors: errors.array({onlyFirstError: true}),
        });
    }
};

export async function isUniqueUsername(username: string) {
    if(await User.findOne({username})) throw new Error();
}

export async function isUniqueClientID(clientID: string) {
    if(await Client.findOne({clientID})) throw new Error();
}

export async function isUniqueEmail(email: string) {
    if(await User.findOne({email})) throw new Error();
}

type TValidationWrapper = (fields: string | string[]) => ValidationChain;

export const validateUsername: TValidationWrapper = (fields) =>
    body(fields)
        .isAlphanumeric()
        .withMessage('Invalid characters')
        .isLength({min: 4, max: 30})
        .custom(isUniqueUsername);

export const validateClientID: TValidationWrapper = (fields) =>
    body(fields)
        .isAlphanumeric()
        .withMessage('Invalid characters')
        .isLength({min: 4, max: 30})
        .custom(isUniqueClientID);

export const validateEmail: TValidationWrapper = (fields) =>
    body(fields).isEmail().custom(isUniqueEmail);

export const validatePassword: TValidationWrapper = (fields) =>
    body(fields).isLength({min: 4, max: 30});
