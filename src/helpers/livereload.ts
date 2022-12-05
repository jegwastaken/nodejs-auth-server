/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import {Express} from 'express';

export default function lr(app: Express) {
    if(process.env.NODE_ENV !== 'production') {
        const livereload = require('livereload');
        const connectLivereload = require('connect-livereload');

        const liveReloadServer = livereload.createServer();

        liveReloadServer.server.once('connection', () => {
            setTimeout(() => {
                liveReloadServer.refresh('/');
            }, 50);
        });

        app.use(connectLivereload());
    }
}
