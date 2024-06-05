"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const bcrypt_1 = require("bcrypt");
const user_1 = __importDefault(require("../models/user"));
const errors_1 = require("../helpers/errors");
exports.addUser = [
    (0, errors_1.validateUsername)('new-username'),
    (0, errors_1.validateEmail)('new-email'),
    (0, errors_1.validatePassword)('new-password'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        (0, errors_1.getValidationErrors)(req, next);
        const salt = yield (0, bcrypt_1.genSalt)();
        const hashed = yield (0, bcrypt_1.hash)(req.body['new-password'], salt);
        const user = new user_1.default({
            username: req.body['new-username'],
            email: req.body['new-email'],
            password: hashed,
        });
        return user
            .save()
            .then((addedUser) => res.send(addedUser))
            .catch((userSaveErr) => next(userSaveErr));
    }),
];
//# sourceMappingURL=user.js.map