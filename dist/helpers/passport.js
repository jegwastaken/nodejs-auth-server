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
const bcrypt_1 = require("bcrypt");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_http_1 = require("passport-http");
const passport_http_bearer_1 = require("passport-http-bearer");
const passport_oauth2_client_password_1 = require("passport-oauth2-client-password");
const passport_oauth2_client_pkce_1 = require("passport-oauth2-client-pkce");
const user_1 = __importDefault(require("../models/user"));
const client_1 = __importDefault(require("../models/client"));
const accessToken_1 = __importDefault(require("../models/accessToken"));
const utils_1 = require("./utils");
passport_1.default.serializeUser((user, done) => {
    (0, utils_1.devlog)('serializeUser');
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    (0, utils_1.devlog)('deserializeUser');
    return done(null, user);
});
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('LocalStrategy');
    const user = yield user_1.default.findOne({
        $or: [{ username }, { email: username }],
    })
        .select('+password')
        .catch((err) => done(err));
    if (!user)
        return done(null, false);
    if (!user.password)
        return done(null, false);
    const passwordsMatch = yield (0, bcrypt_1.compare)(password, user.password);
    if (!passwordsMatch)
        return done(null, false);
    // eslint-disable-next-line no-undefined
    user.password = undefined;
    return done(null, user);
})));
function verifyClient(clientID, clientsecret, done) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.devlog)('verifyClient');
        const client = yield client_1.default.findById(clientID)
            .select('+clientsecret')
            .catch((err) => done(err));
        if (!client)
            return done(null, false);
        if (!client.clientsecret)
            return done(null, false);
        const secretsMatch = yield (0, bcrypt_1.compare)(clientsecret, client.clientsecret);
        if (!secretsMatch)
            return done(null, false);
        // eslint-disable-next-line no-undefined
        client.clientsecret = undefined;
        return done(null, client);
    });
}
passport_1.default.use(new passport_http_1.BasicStrategy(verifyClient));
passport_1.default.use(new passport_oauth2_client_password_1.Strategy(verifyClient));
passport_1.default.use(new passport_oauth2_client_pkce_1.Strategy((clientID, codeverifier, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('ClientPKCEStrategy');
    const client = yield client_1.default.findById(clientID).catch((err) => done(err));
    if (!client)
        return done(null, false);
    if (!codeverifier)
        return done(null, false);
    return done(null, client);
})));
passport_1.default.use(new passport_http_bearer_1.Strategy((accesstoken, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('BearerStrategy');
    const token = yield accessToken_1.default.findOne({ token: accesstoken }).catch((err) => done(err));
    if (!token)
        return done(null, false);
    const user = yield user_1.default.findById(token.userID).catch((err) => done(err));
    if (!user)
        return done(null, false);
    return done(null, user, { scope: '*' });
})));
//# sourceMappingURL=passport.js.map