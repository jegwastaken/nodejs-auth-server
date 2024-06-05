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
exports.token = exports.decision = exports.authorization = void 0;
const connect_ensure_login_1 = __importDefault(require("connect-ensure-login"));
const oauth2orize_1 = __importDefault(require("oauth2orize"));
const oauth2orize_pkce_1 = __importDefault(require("oauth2orize-pkce"));
const passport_1 = __importDefault(require("passport"));
const utils_1 = require("./utils");
const client_1 = __importDefault(require("../models/client"));
const user_1 = __importDefault(require("../models/user"));
const accessToken_1 = __importDefault(require("../models/accessToken"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const authCode_1 = __importDefault(require("../models/authCode"));
const server = oauth2orize_1.default.createServer();
server.serializeClient((client, done) => {
    (0, utils_1.devlog)('serializeClient');
    return done(null, client._id);
});
server.deserializeClient((clientID, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('deserializeClient');
    const client = yield client_1.default.findById(clientID).catch((err) => done(err));
    if (!client)
        return done(null, false);
    return done(null, client);
}));
function issueTokens(userID, clientID, done) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.devlog)('issueTokens');
        const user = yield user_1.default.findById(userID).catch((err) => done(err));
        if (!user)
            return done(null, false);
        const accessToken = (0, utils_1.getUid)(256);
        const savedAccessToken = yield new accessToken_1.default({
            userID,
            clientID,
            token: accessToken,
        })
            .save()
            .catch((err) => done(err));
        const refreshToken = (0, utils_1.getUid)(256);
        yield new refreshToken_1.default({
            userID,
            clientID,
            accesstoken: accessToken,
            token: (0, utils_1.getUid)(256),
        })
            .save()
            .catch((err) => done(err));
        const params = { expiration: (savedAccessToken || {}).expiration };
        return done(null, accessToken, refreshToken, params);
    });
}
server.grant(oauth2orize_pkce_1.default.extensions());
server.grant(oauth2orize_1.default.grant.code((client, redirectURI, user, ares, req, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('oauth2orize.grant.code');
    const code = (0, utils_1.getUid)(16);
    const { codeChallenge, codeChallengeMethod } = req;
    const ValidCodeChallengeMethod = codeChallengeMethod === 'S256' ? 'S256' : 'plain';
    yield new authCode_1.default({
        userID: user.id,
        clientID: client.id,
        redirectURI,
        code,
        codeChallenge,
        codeChallengeMethod: ValidCodeChallengeMethod,
    })
        .save()
        .catch((err) => done(err));
    return done(null, code);
})));
server.exchange(oauth2orize_1.default.exchange.code((client, code, redirectURI, reqBody, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('oauth2orize.exchange.code');
    const authCode = yield authCode_1.default.findOneAndDelete({ code }).catch((err) => done(err));
    if (!authCode)
        return done(null, false);
    if (!authCode.clientID.equals(client.id))
        return done(null, false);
    if (!reqBody || !reqBody.code_verifier)
        return done(null, false);
    if (redirectURI !== authCode.redirectURI)
        return done(null, false);
    if (!(0, utils_1.verifyProofKey)(authCode.codeChallenge, authCode.codeChallengeMethod, reqBody.code_verifier)) {
        return done(null, false);
    }
    return issueTokens(authCode.userID, client.id, done);
})));
server.exchange(oauth2orize_1.default.exchange.refreshToken((client, refreshtoken, _scope, done) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.devlog)('oauth2orize.exchange.refreshToken');
    const storedRefreshToken = yield refreshToken_1.default.findOneAndDelete({
        token: refreshtoken,
    }).catch((err) => done(err));
    if (!storedRefreshToken)
        return done(null, false);
    if (!storedRefreshToken.clientID.equals(client.id)) {
        return done(null, false);
    }
    yield accessToken_1.default.deleteOne({
        token: storedRefreshToken.accesstoken,
    }).catch((err) => done(err));
    return issueTokens(storedRefreshToken.userID, client.id, done);
})));
exports.authorization = [
    connect_ensure_login_1.default.ensureLoggedIn(),
    server.authorization((clientID, redirectURI, done) => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.devlog)('authorization.ValidateFunction');
        const client = yield client_1.default.findById(clientID).catch((err) => done(err));
        if (!client)
            return done(null, false);
        if (client.redirectURI !== redirectURI)
            return done(null, false);
        return done(null, client, redirectURI);
    }), (client, user, _scope, _type, req, done) => __awaiter(void 0, void 0, void 0, function* () {
        (0, utils_1.devlog)('authorization.ImmediateFunction');
        const { state, codeChallenge } = req;
        if (!state) {
            const stateErr = {
                name: 'UnnamedError',
                message: 'Missing required parameter: state',
            };
            return done(stateErr, false, null, null);
        }
        if (!codeChallenge) {
            const codeChallengeErr = {
                name: 'UnnamedError',
                message: 'Missing required parameter: code_challenge',
            };
            return done(codeChallengeErr, false, null, null);
        }
        if (client.trusted)
            return done(null, true, null, null);
        const accessToken = yield accessToken_1.default.findOne({
            userID: user.id,
            clientID: client.id,
        }).catch((err) => done(err, false, null, null));
        if (!accessToken)
            return done(null, false, null, null);
        return done(null, true, null, null);
    })),
    (req, res) => res.render('dialog', {
        transactionID: (req.oauth2 || {}).transactionID,
        user: req.user,
        client: (req.oauth2 || {}).client.toJSON(),
    }),
];
exports.decision = [connect_ensure_login_1.default.ensureLoggedIn(), server.decision()];
exports.token = [
    passport_1.default.authenticate(['basic', 'oauth2-client-password', 'oauth2-client-pkce'], {
        session: false,
    }),
    server.token(),
    server.errorHandler(),
];
//# sourceMappingURL=oauth2.js.map