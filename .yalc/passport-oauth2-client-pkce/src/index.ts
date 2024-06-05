import passport from "passport-strategy";

type VerifyFunction = (
  clientId: string,
  codeverifier: string,
  verified: (...args: any[]) => void
) => void;

type VerifyFunctionWithReq = (
  req: any,
  clientId: string,
  codeverifier: string,
  verified: (...args: any[]) => void
) => void;

export class Strategy extends passport.Strategy {
  name: string;
  verify: VerifyFunction | VerifyFunctionWithReq;
  passReqToCallback: boolean;

  constructor(
    options: { passReqToCallback?: boolean },
    verify: VerifyFunctionWithReq | VerifyFunction
  );

  constructor(verify: VerifyFunction);

  constructor(
    options: { passReqToCallback?: boolean } | VerifyFunction,
    verify?: VerifyFunctionWithReq | VerifyFunction
  ) {
    super();

    if (typeof options === "function") {
      verify = options as VerifyFunction;
      options = {};
    }

    if (!verify) {
      throw new Error(
        "OAuth 2.0 client PKCE strategy requires a verify function"
      );
    }

    this.name = "oauth2-client-pkce";
    this.verify = verify;
    this.passReqToCallback = options.passReqToCallback || false;
  }

  authenticate(req: any) {
    const noClientInBody = !req.body || !req.body["client_id"];
    const noClientInHeaders = !req.headers || !req.headers["cid"];

    if (noClientInBody && noClientInHeaders) return this.fail(401);

    var clientId = req.body["client_id"] || req.headers["cid"];
    var codeverifier = req.body["codeverifier"];
    var self = this;

    function verified(err: any, client: any, info: any) {
      if (err) return self.error(err);
      if (!client) return self.fail(401);

      self.success(client, info);
    }

    if (self.passReqToCallback) {
      (this.verify as VerifyFunctionWithReq)(
        req,
        clientId,
        codeverifier,
        verified
      );
    } else {
      (this.verify as VerifyFunction)(clientId, codeverifier, verified);
    }
  }
}
