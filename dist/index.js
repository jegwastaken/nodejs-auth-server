"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
require("dotenv/config");
require("./helpers/db");
require("./helpers/passport");
require("./helpers/oauth2");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_sqlite3_1 = __importDefault(require("connect-sqlite3"));
const cors_1 = __importDefault(require("cors"));
const express_handlebars_1 = require("express-handlebars");
const meta_1 = __importDefault(require("./helpers/meta"));
const livereload_1 = __importDefault(require("./helpers/livereload"));
const routes_1 = __importDefault(require("./helpers/routes"));
const errors_1 = require("./helpers/errors");
const app = (0, express_1.default)();
exports.sessionStore = new ((0, connect_sqlite3_1.default)(express_session_1.default))({
    db: 'sessions.db',
    dir: path_1.default.resolve(__dirname, '../'),
});
(0, livereload_1.default)(app);
app.engine('hbs', (0, express_handlebars_1.engine)({ extname: '.hbs', helpers: meta_1.default }));
const viewsDir = path_1.default.resolve(__dirname, '../views');
const publicJsDir = path_1.default.resolve(__dirname, './public');
app.set('view engine', 'hbs');
app.set('views', viewsDir);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(`${meta_1.default.subDir}/assets/js`, express_1.default.static(publicJsDir));
app.use(`${meta_1.default.subDir}/assets/css`, express_1.default.static(`${viewsDir}/css`));
app.use((0, express_session_1.default)({
    // Don't forget to set this env variable
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    store: exports.sessionStore,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(meta_1.default.subDir, (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 120,
}), routes_1.default);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-param-reassign
    if (err.message)
        err = (0, errors_1.errorFormatter)(err.message);
    return res.status(err.status || 500).send(err);
};
app.use(errorHandler);
const server = app.listen(meta_1.default.port, () => {
    console.log(`App listening on port ${meta_1.default.port}`);
});
function closeApp() {
    console.log('\nClosing app...');
    mongoose_1.default.connection.close((dbCloseError) => {
        if (dbCloseError) {
            console.log('\nError closing database connection...');
            console.error(dbCloseError);
        }
        else {
            console.log('\nDatabase connection closed!');
        }
        server.close((serverCloseError) => {
            if (serverCloseError) {
                console.log('\nError closing server...');
                console.error(serverCloseError);
            }
            else {
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
