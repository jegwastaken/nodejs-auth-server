"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenSchema = void 0;
/* eslint-disable no-param-reassign */
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
exports.accessTokenSchema = new mongoose_1.Schema({
    userID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    clientID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Client' },
    token: { type: String, required: true },
    expiration: {
        type: Date,
        immutable: true,
    },
});
exports.accessTokenSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });
exports.accessTokenSchema.pre('save', function preSave(next) {
    if (!this.expiration) {
        if (!this.created)
            this.created = new Date();
        this.expiration = new Date(
        // 12 hours
        this.created.getTime() + 60 * 60 * 12 * 1000);
    }
    return next();
});
(0, utils_1.modifySchema)(exports.accessTokenSchema);
exports.default = (0, mongoose_1.model)('AccessToken', exports.accessTokenSchema);
