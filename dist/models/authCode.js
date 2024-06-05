"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCodeSchema = void 0;
/* eslint-disable no-param-reassign */
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
exports.authCodeSchema = new mongoose_1.Schema({
    userID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    clientID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Client' },
    code: { type: String, required: true },
    redirectURI: { type: String, required: true },
    codeChallenge: { type: String, required: true },
    codeChallengeMethod: { type: String, required: true },
});
exports.authCodeSchema.index({ created: 1 }, { expireAfterSeconds: 60 });
(0, utils_1.modifySchema)(exports.authCodeSchema);
exports.default = (0, mongoose_1.model)('AuthCode', exports.authCodeSchema);
//# sourceMappingURL=authCode.js.map