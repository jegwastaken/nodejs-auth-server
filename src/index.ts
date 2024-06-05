import 'dotenv/config';
import './helpers/db';
import './helpers/passport';
import './helpers/oauth2';

import path from 'path';
import express, {ErrorRequestHandler} from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import connectSqlite from 'connect-sqlite3';
import cors from 'cors';
import {engine as hbs} from 'express-handlebars';
import meta from './helpers/meta';
import livereload from './helpers/livereload';
import routes from './helpers/routes';
import {errorFormatter} from './helpers/errors';

const app = express();

export const sessionStore = new (connectSqlite(session))({
    db: 'sessions.db',
    dir: path.resolve(__dirname, '../'),
});

livereload(app);

app.engine('hbs', hbs({extname: '.hbs', helpers: meta}));

const viewsDir = path.resolve(__dirname, '../views');
const publicJsDir = path.resolve(__dirname, './public');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
    `${meta.subDir}/assets/js`,
    express.static(publicJsDir, {extensions: ['js']}),
);
app.use(`${meta.subDir}/assets/css`, express.static(`${viewsDir}/css`));

app.use(
    session({
        // Don't forget to set this env variable
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    meta.subDir,
    rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 120,
    }),
    routes,
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-param-reassign
    if(err.message) err = errorFormatter(err.message);

    return res.status(err.status || 500).send(err);
};

app.use(errorHandler);

const server = app.listen(meta.port, () => {
    console.log(`App listening on port ${meta.port}`);
});

function closeApp() {
    console.log('\nClosing app...');

    mongoose.connection.close((dbCloseError) => {
        if(dbCloseError) {
            console.log('\nError closing database connection...');
            console.error(dbCloseError);
        } else {
            console.log('\nDatabase connection closed!');
        }

        server.close((serverCloseError) => {
            if(serverCloseError) {
                console.log('\nError closing server...');
                console.error(serverCloseError);
            } else {
                console.log('Server closed!');
            }

            process.exit(dbCloseError || serverCloseError ? 1 : 0);
        });
    });
}

process.on('SIGINT', closeApp);
process.on('SIGTERM', closeApp);
process.on('SIGQUIT', closeApp);
process.on('SIGTSTP', closeApp);
