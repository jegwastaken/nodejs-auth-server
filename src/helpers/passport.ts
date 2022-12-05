import {compare} from 'bcrypt';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as ClientPasswordStrategy} from 'passport-oauth2-client-password';
import {Strategy as ClientPKCEStrategy} from 'passport-oauth2-client-pkce';
import User from '../models/user';
import Client, {IClient} from '../models/client';
import AccessToken from '../models/accessToken';
import {devlog, RaggedyAny} from './utils';

passport.serializeUser((user, done) => {
    devlog('serializeUser');

    return done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    devlog('deserializeUser');

    return done(null, user);
});

passport.use(
    new LocalStrategy(async(username, password, done) => {
        devlog('LocalStrategy');

        const user = await User.findOne({
            $or: [{username}, {email: username}],
        })
            .select('+password')
            .catch((err) => done(err));

        if(!user) return done(null, false);
        if(!user.password) return done(null, false);

        const passwordsMatch = await compare(password, user.password);

        if(!passwordsMatch) return done(null, false);

        // eslint-disable-next-line no-undefined
        user.password = undefined;

        return done(null, user);
    }),
);

async function verifyClient(
    clientID: string,
    clientsecret: string,
    done: (error: unknown, client?: IClient | false, info?: RaggedyAny) => void,
) {
    devlog('verifyClient');

    const client = await Client.findById(clientID)
        .select('+clientsecret')
        .catch((err) => done(err));

    if(!client) return done(null, false);
    if(!client.clientsecret) return done(null, false);

    const secretsMatch = await compare(clientsecret, client.clientsecret);

    if(!secretsMatch) return done(null, false);

    // eslint-disable-next-line no-undefined
    client.clientsecret = undefined;

    return done(null, client);
}

passport.use(new BasicStrategy(verifyClient));
passport.use(new ClientPasswordStrategy(verifyClient));

passport.use(
    new ClientPKCEStrategy(async(clientID, codeverifier, done) => {
        devlog('ClientPKCEStrategy');

        const client = await Client.findById(clientID).catch((err) =>
            done(err));

        if(!client) return done(null, false);
        if(!codeverifier) return done(null, false);

        return done(null, client);
    }),
);

passport.use(
    new BearerStrategy(async(accesstoken, done) => {
        devlog('BearerStrategy');

        const token = await AccessToken.findOne({token: accesstoken}).catch(
            (err) => done(err),
        );

        if(!token) return done(null, false);

        const user = await User.findById(token.userID).catch((err) =>
            done(err));

        if(!user) return done(null, false);

        return done(null, user, {scope: '*'});
    }),
);
