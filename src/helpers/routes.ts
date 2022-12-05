import {Router as r} from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import login from 'connect-ensure-login';
import meta from './meta';
import {authorization, decision, token} from './oauth2';
import {addUser} from '../controllers/user';
import {addClient} from '../controllers/client';

const router = r();

router.route('/').get((req, res) => {
    res.render('index', {user: req.user});
});

router
    .route('/login')
    .get(login.ensureLoggedOut(), (_req, res) => res.render('login'))
    .post((req, res, next) =>
        passport.authenticate('local', {
            successReturnToOrRedirect:
                (req.session || {}).returnTo || `${meta.subDir}/`,
            failureRedirect: `${meta.subDir}/login`,
        })(req, res, next));

router.route('/logout').get((req, res, next) =>
    req.logout((err) => {
        if(err) return next(err);

        return res.redirect(`${meta.subDir}/`);
    }));

router
    .route('/sign-up')
    .get((_req, res) => res.render('sign-up'))
    .post(addUser);

router
    .route('/new-client')
    .get(login.ensureLoggedIn(), (_req, res) => res.render('new-client'))
    .post(addClient);

router.route('/dialog/authorize').get(authorization);
router.route('/dialog/authorize/decision').post(decision);

router.route('/oauth/token').post(
    rateLimit({
        windowMs: 60 * 60 * 24 * 1000, // 24 hours
        max: 60,
    }),
    token,
);

export default router;
