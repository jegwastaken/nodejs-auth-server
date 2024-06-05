"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
/* eslint-disable no-param-reassign */
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
exports.userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
});
(0, utils_1.modifySchema)(exports.userSchema);
exports.default = (0, mongoose_1.model)('User', exports.userSchema);
//# sourceMappingURL=user.js.map