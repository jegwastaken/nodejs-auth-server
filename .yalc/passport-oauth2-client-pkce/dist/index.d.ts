import passport from "passport-strategy";
type VerifyFunction = (clientId: string, codeverifier: string, verified: (...args: any[]) => void) => void;
type VerifyFunctionWithReq = (req: any, clientId: string, codeverifier: string, verified: (...args: any[]) => void) => void;
export declare class Strategy extends passport.Strategy {
    name: string;
    verify: VerifyFunction | VerifyFunctionWithReq;
    passReqToCallback: boolean;
    constructor(options: {
        passReqToCallback?: boolean;
    }, verify: VerifyFunctionWithReq | VerifyFunction);
    constructor(verify: VerifyFunction);
    authenticate(req: any): void;
}
export {};
