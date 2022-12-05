"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = void 0;
/* eslint-disable no-param-reassign */
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
exports.refreshTokenSchema = new mongoose_1.Schema({
    userID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    clientID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Client' },
    accesstoken: { type: String, required: true },
    token: { type: String, required: true },
    expiration: {
        type: Date,
        immutable: true,
    },
});
exports.refreshTokenSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });
exports.refreshTokenSchema.pre('save', function preSave(next) {
    if (!this.expiration) {
        if (!this.created)
            this.created = new Date();
        this.expiration = new Date(
        // 14 days
        this.created.getTime() + 60 * 60 * 24 * 14 * 1000);
    }
    return next();
});
(0, utils_1.modifySchema)(exports.refreshTokenSchema);
exports.default = (0, mongoose_1.model)('RefreshToken', exports.refreshTokenSchema);
