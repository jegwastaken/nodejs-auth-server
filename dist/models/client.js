"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
exports.clientSchema = new mongoose_1.Schema({
    clientname: { type: String, required: true },
    clientsecret: { type: String, required: true, select: false },
    redirectURI: { type: String, required: true },
    userID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    trusted: {
        type: Boolean,
        required: true,
        default: false,
        immutable: true,
    },
});
(0, utils_1.modifySchema)(exports.clientSchema);
exports.default = (0, mongoose_1.model)('Client', exports.clientSchema);
