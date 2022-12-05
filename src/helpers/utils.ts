/* eslint-disable no-param-reassign */
import {Schema, ToObjectOptions, Types} from 'mongoose';
import {createHash} from 'crypto';
import {CodeChallengeMethod} from './oauth2';

declare module 'express-session' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface SessionData {
        returnTo?: string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RaggedyAny = any;

export interface IModel {
    _id: Types.ObjectId;
    id: string;
    created: Date;
    updated: Date;
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getUid(length: number) {
    let uid = '';

    const chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < length; ++i) {
        uid += chars[getRandomInt(0, chars.length - 1)];
    }

    return uid;
}

export function modifySchema(schema: Schema<RaggedyAny>) {
    schema.set('timestamps', {
        createdAt: 'created',
        updatedAt: 'updated',
    });

    const opts: ToObjectOptions = {
        transform: (_doc, ret) => {
            ret.id = _doc.id;

            delete ret._id;
            delete ret.__v;

            return ret;
        },
    };

    schema.set('toJSON', opts);
    schema.set('toObject', opts);
}

export function devlog(message?: RaggedyAny, ...optionalParams: RaggedyAny[]) {
    if(process.env.NODE_ENV === 'production') return;

    console.log('\x1b[33m%s\x1b[0m', 'DEVLOG:', message, ...optionalParams);
}

export function base64URLEncode(buf: Buffer) {
    return buf
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function sha256(str: string) {
    return createHash('sha256').update(str).digest();
}

export function verifyProofKey(
    challenge: string,
    method: CodeChallengeMethod,
    verifier: string,
) {
    return (
        (method === 'S256' ? base64URLEncode(sha256(verifier)) : verifier)
        === challenge
    );
}
