"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function lr(app) {
    if (process.env.NODE_ENV !== 'production') {
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
exports.default = lr;
