"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProofKey = exports.sha256 = exports.base64URLEncode = exports.devlog = exports.modifySchema = exports.getUid = exports.getRandomInt = void 0;
const crypto_1 = require("crypto");
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function getUid(length) {
    let uid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInt(0, chars.length - 1)];
    }
    return uid;
}
exports.getUid = getUid;
function modifySchema(schema) {
    schema.set('timestamps', {
        createdAt: 'created',
        updatedAt: 'updated',
    });
    const opts = {
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
exports.modifySchema = modifySchema;
function devlog(message, ...optionalParams) {
    if (process.env.NODE_ENV === 'production')
        return;
    console.log('\x1b[33m%s\x1b[0m', 'DEVLOG:', message, ...optionalParams);
}
exports.devlog = devlog;
function base64URLEncode(buf) {
    return buf
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
exports.base64URLEncode = base64URLEncode;
function sha256(str) {
    return (0, crypto_1.createHash)('sha256').update(str).digest();
}
exports.sha256 = sha256;
function verifyProofKey(challenge, method, verifier) {
    return ((method === 'S256' ? base64URLEncode(sha256(verifier)) : verifier)
        === challenge);
}
exports.verifyProofKey = verifyProofKey;
//# sourceMappingURL=utils.js.map