"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = __importDefault(require("passport"));
const connect_ensure_login_1 = __importDefault(require("connect-ensure-login"));
const meta_1 = __importDefault(require("./meta"));
const oauth2_1 = require("./oauth2");
const user_1 = require("../controllers/user");
const client_1 = require("../controllers/client");
const router = (0, express_1.Router)();
router.route('/').get((req, res) => {
    res.render('index', { user: req.user });
});
router
    .route('/login')
    .get(connect_ensure_login_1.default.ensureLoggedOut(), (_req, res) => res.render('login'))
    .post((req, res, next) => passport_1.default.authenticate('local', {
    successReturnToOrRedirect: (req.session || {}).returnTo || `${meta_1.default.subDir}/`,
    failureRedirect: `${meta_1.default.subDir}/login`,
})(req, res, next));
router.route('/logout').get((req, res, next) => req.logout((err) => {
    if (err)
        return next(err);
    return res.redirect(`${meta_1.default.subDir}/`);
}));
router
    .route('/sign-up')
    .get((_req, res) => res.render('sign-up'))
    .post(user_1.addUser);
router
    .route('/new-client')
    .get(connect_ensure_login_1.default.ensureLoggedIn(), (_req, res) => res.render('new-client'))
    .post(client_1.addClient);
router.route('/dialog/authorize').get(oauth2_1.authorization);
router.route('/dialog/authorize/decision').post(oauth2_1.decision);
router.route('/oauth/token').post((0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 24 * 1000,
    max: 60,
}), oauth2_1.token);
exports.default = router;
