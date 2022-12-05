import path from 'path';

export default {
    appName: 'Auth Server',
    port: process.env.PORT || 3000,
    subDir: process.env.SUB_DIR
        ? path.resolve('/', process.env.SUB_DIR || '').replace(/\/+$/, '')
        : '',
};
