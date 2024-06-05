"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = {
    appName: 'Auth Server',
    port: process.env.PORT || 3000,
    subDir: process.env.SUB_DIR
        ? path_1.default.resolve('/', process.env.SUB_DIR || '').replace(/\/+$/, '')
        : '',
};
//# sourceMappingURL=meta.js.map