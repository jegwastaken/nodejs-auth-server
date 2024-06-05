"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const passport_strategy_1 = __importDefault(require("passport-strategy"));
class Strategy extends passport_strategy_1.default.Strategy {
    constructor(options, verify) {
        super();
        if (typeof options === "function") {
            verify = options;
            options = {};
        }
        if (!verify) {
            throw new Error("OAuth 2.0 client PKCE strategy requires a verify function");
        }
        this.name = "oauth2-client-pkce";
        this.verify = verify;
        this.passReqToCallback = options.passReqToCallback || false;
    }
    authenticate(req) {
        const noClientInBody = !req.body || !req.body["client_id"];
        const noClientInHeaders = !req.headers || !req.headers["cid"];
        if (noClientInBody && noClientInHeaders)
            return this.fail(401);
        var clientId = req.body["client_id"] || req.headers["cid"];
        var codeverifier = req.body["codeverifier"];
        var self = this;
        function verified(err, client, info) {
            if (err)
                return self.error(err);
            if (!client)
                return self.fail(401);
            self.success(client, info);
        }
        if (self.passReqToCallback) {
            this.verify(req, clientId, codeverifier, verified);
        }
        else {
            this.verify(clientId, codeverifier, verified);
        }
    }
}
exports.Strategy = Strategy;
