import login from 'connect-ensure-login';
import oauth2orize from 'oauth2orize';
import pkce from 'oauth2orize-pkce';
import {Request, Response} from 'express';
import {Types} from 'mongoose';
import passport from 'passport';
import {devlog, getUid, RaggedyAny, verifyProofKey} from './utils';
import Client, {IClient} from '../models/client';
import User from '../models/user';
import AccessToken from '../models/accessToken';
import RefreshToken from '../models/refreshToken';
import AuthCode from '../models/authCode';

const server = oauth2orize.createServer();

server.serializeClient((client, done) => {
    devlog('serializeClient');

    return done(null, client._id);
});

server.deserializeClient(async(clientID, done) => {
    devlog('deserializeClient');

    const client = await Client.findById(clientID).catch((err) => done(err));

    if(!client) return done(null, false);

    return done(null, client);
});

async function issueTokens(
    userID: string | Types.ObjectId,
    clientID: string | Types.ObjectId,
    done: oauth2orize.ExchangeDoneFunction,
) {
    devlog('issueTokens');

    const user = await User.findById(userID).catch((err) => done(err));

    if(!user) return done(null, false);

    const accessToken = getUid(256);

    const savedAccessToken = await new AccessToken({
        userID,
        clientID,
        token: accessToken,
    })
        .save()
        .catch((err) => done(err));

    const refreshToken = getUid(256);

    await new RefreshToken({
        userID,
        clientID,
        accesstoken: accessToken,
        token: getUid(256),
    })
        .save()
        .catch((err) => done(err));

    const params = {expiration: (savedAccessToken || {}).expiration};

    return done(null, accessToken, refreshToken, params);
}

server.grant(pkce.extensions());

export type CodeChallengeMethod = 'S256' | 'plain';

type PseudoIssueGrantCodeFunction = (
    issue: (
        client: IClient,
        redirectURI: string,
        user: Express.User,
        ares: RaggedyAny,
        req: RaggedyAny,
        issued: (err: Error | null, code?: string) => void
    ) => void
) => oauth2orize.MiddlewareFunction;

server.grant(
    (oauth2orize.grant.code as unknown as PseudoIssueGrantCodeFunction)(
        async(client, redirectURI, user, ares, req, done) => {
            devlog('oauth2orize.grant.code');

            const code = getUid(16);
            const {codeChallenge, codeChallengeMethod} = req;

            const ValidCodeChallengeMethod: CodeChallengeMethod
                = codeChallengeMethod === 'S256' ? 'S256' : 'plain';

            await new AuthCode({
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
        },
    ),
);

type PseudoIssueExchangeCodeFunction = (
    issue: (
        client: IClient,
        code: string,
        redirectURI: string,
        reqBody: RaggedyAny,
        issued: oauth2orize.ExchangeDoneFunction
    ) => void
) => oauth2orize.MiddlewareFunction;

server.exchange(
    (oauth2orize.exchange.code as unknown as PseudoIssueExchangeCodeFunction)(
        async(client, code, redirectURI, reqBody, done) => {
            devlog('oauth2orize.exchange.code');

            const authCode = await AuthCode.findOneAndDelete({code}).catch(
                (err) => done(err),
            );

            if(!authCode) return done(null, false);
            if(!authCode.clientID.equals(client.id)) return done(null, false);
            if(!reqBody || !reqBody.code_verifier) return done(null, false);
            if(redirectURI !== authCode.redirectURI) return done(null, false);

            if(
                !verifyProofKey(
                    authCode.codeChallenge,
                    authCode.codeChallengeMethod,
                    reqBody.code_verifier,
                )
            ) {
                return done(null, false);
            }

            return issueTokens(authCode.userID, client.id, done);
        },
    ),
);

server.exchange(
    oauth2orize.exchange.refreshToken(
        async(client: IClient, refreshtoken, _scope, done) => {
            devlog('oauth2orize.exchange.refreshToken');

            const storedRefreshToken = await RefreshToken.findOneAndDelete({
                token: refreshtoken,
            }).catch((err) => done(err));

            if(!storedRefreshToken) return done(null, false);

            if(!storedRefreshToken.clientID.equals(client.id)) {
                return done(null, false);
            }

            await AccessToken.deleteOne({
                token: storedRefreshToken.accesstoken,
            }).catch((err) => done(err));

            return issueTokens(storedRefreshToken.userID, client.id, done);
        },
    ),
);

export const authorization = [
    login.ensureLoggedIn(),
    server.authorization(
        async(clientID, redirectURI, done) => {
            devlog('authorization.ValidateFunction');

            const client = await Client.findById(clientID).catch((err) =>
                done(err));

            if(!client) return done(null, false);
            if(client.redirectURI !== redirectURI) return done(null, false);

            return done(null, client, redirectURI);
        },
        async(
            client: IClient,
            user: Express.User,
            _scope,
            _type,
            req,
            done,
        ) => {
            devlog('authorization.ImmediateFunction');

            const {state, codeChallenge} = req;

            if(!state) {
                const stateErr = {
                    name: 'UnnamedError',
                    message: 'Missing required parameter: state',
                };

                return done(stateErr, false, null, null);
            }

            if(!codeChallenge) {
                const codeChallengeErr = {
                    name: 'UnnamedError',
                    message: 'Missing required parameter: code_challenge',
                };

                return done(codeChallengeErr, false, null, null);
            }

            if(client.trusted) return done(null, true, null, null);

            const accessToken = await AccessToken.findOne({
                userID: user.id,
                clientID: client.id,
            }).catch((err) => done(err, false, null, null));

            if(!accessToken) return done(null, false, null, null);

            return done(null, true, null, null);
        },
    ),
    (req: Request, res: Response) =>
        res.render('dialog', {
            transactionID: (req.oauth2 || {}).transactionID,
            user: req.user,
            client: (req.oauth2 || {}).client.toJSON(),
        }),
];

export const decision = [login.ensureLoggedIn(), server.decision()];

export const token = [
    passport.authenticate(
        ['basic', 'oauth2-client-password', 'oauth2-client-pkce'],
        {
            session: false,
        },
    ),
    server.token(),
    server.errorHandler(),
];
