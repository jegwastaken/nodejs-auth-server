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
exports.validatePassword = exports.validateEmail = exports.validateClientID = exports.validateUsername = exports.isUniqueEmail = exports.isUniqueClientID = exports.isUniqueUsername = exports.getValidationErrors = exports.validationErrorFormatter = exports.errorFormatter = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const client_1 = __importDefault(require("../models/client"));
const errorFormatter = (message = 'An error occured', status = 400) => ({
    status,
    errors: [{ message }],
});
exports.errorFormatter = errorFormatter;
const validationErrorFormatter = ({ msg, param, value, }) => ({
    message: msg,
    value,
    parameter: param,
});
exports.validationErrorFormatter = validationErrorFormatter;
// eslint-disable-next-line consistent-return
const getValidationErrors = (req, next) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(exports.validationErrorFormatter);
    if (!errors.isEmpty()) {
        return next({
            status: 400,
            errors: errors.array({ onlyFirstError: true }),
        });
    }
};
exports.getValidationErrors = getValidationErrors;
function isUniqueUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield user_1.default.findOne({ username }))
            throw new Error();
    });
}
exports.isUniqueUsername = isUniqueUsername;
function isUniqueClientID(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield client_1.default.findOne({ clientID }))
            throw new Error();
    });
}
exports.isUniqueClientID = isUniqueClientID;
function isUniqueEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield user_1.default.findOne({ email }))
            throw new Error();
    });
}
exports.isUniqueEmail = isUniqueEmail;
const validateUsername = (fields) => (0, express_validator_1.body)(fields)
    .isAlphanumeric()
    .withMessage('Invalid characters')
    .isLength({ min: 4, max: 30 })
    .custom(isUniqueUsername);
exports.validateUsername = validateUsername;
const validateClientID = (fields) => (0, express_validator_1.body)(fields)
    .isAlphanumeric()
    .withMessage('Invalid characters')
    .isLength({ min: 4, max: 30 })
    .custom(isUniqueClientID);
exports.validateClientID = validateClientID;
const validateEmail = (fields) => (0, express_validator_1.body)(fields).isEmail().custom(isUniqueEmail);
exports.validateEmail = validateEmail;
const validatePassword = (fields) => (0, express_validator_1.body)(fields).isLength({ min: 4, max: 30 });
exports.validatePassword = validatePassword;
//# sourceMappingURL=errors.js.map