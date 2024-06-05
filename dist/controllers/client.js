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
exports.addClient = void 0;
const bcrypt_1 = require("bcrypt");
const client_1 = __importDefault(require("../models/client"));
const errors_1 = require("../helpers/errors");
const express_validator_1 = require("express-validator");
exports.addClient = [
    (0, errors_1.validateClientID)('new-clientid'),
    (0, express_validator_1.body)('new-clientname').isLength({ min: 4, max: 20 }),
    (0, express_validator_1.body)('new-clientsecret').isStrongPassword(),
    (0, express_validator_1.body)('new-redirectURI').isURL({ require_tld: false }),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return next((0, errors_1.errorFormatter)('Not logged in', 401));
        (0, errors_1.getValidationErrors)(req, next);
        const salt = yield (0, bcrypt_1.genSalt)();
        const hashed = yield (0, bcrypt_1.hash)(req.body['new-clientsecret'], salt);
        const client = new client_1.default({
            userID: req.user.id,
            redirectURI: req.body['new-redirectURI'],
            clientID: req.body['new-clientid'],
            clientname: req.body['new-clientname'],
            clientsecret: hashed,
        });
        return client
            .save()
            .then((addedClient) => res.send(addedClient))
            .catch((clientSaveErr) => next(clientSaveErr));
    }),
];
//# sourceMappingURL=client.js.map