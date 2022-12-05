"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let attempts = 1;
const maxAttempts = 5;
(function attemptConnect() {
    mongoose_1.default.connect(process.env.MONGOURI || '', (err) => {
        if (err) {
            console.error(`Attempt ${attempts}:`, err);
            if (attempts < maxAttempts) {
                attempts += 1;
                setTimeout(attemptConnect, 1000 * 3);
            }
            else {
                attempts = 0;
                console.log(`Maximum attempts reached. Will try again in ${maxAttempts} minutes.`);
                setTimeout(attemptConnect, 1000 * 60 * maxAttempts);
            }
        }
        else {
            console.log(`Connected to database '${mongoose_1.default.connection.db.databaseName}'`);
        }
    });
}());
