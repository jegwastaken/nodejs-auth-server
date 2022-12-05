/* eslint-disable no-param-reassign */
import {model, Schema, Types} from 'mongoose';
import {CodeChallengeMethod} from '../helpers/oauth2';
import {IModel, modifySchema} from '../helpers/utils';

export interface IAuthCode extends IModel {
    userID: Types.ObjectId;
    clientID: Types.ObjectId;
    code: string;
    redirectURI: string;
    codeChallenge: string;
    codeChallengeMethod: CodeChallengeMethod;
}

export const authCodeSchema = new Schema<IAuthCode>({
    userID: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    clientID: {type: Schema.Types.ObjectId, required: true, ref: 'Client'},
    code: {type: String, required: true},
    redirectURI: {type: String, required: true},
    codeChallenge: {type: String, required: true},
    codeChallengeMethod: {type: String, required: true},
});

authCodeSchema.index({created: 1}, {expireAfterSeconds: 60});

modifySchema(authCodeSchema);

export default model<IAuthCode>('AuthCode', authCodeSchema);
