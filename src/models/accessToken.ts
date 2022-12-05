/* eslint-disable no-param-reassign */
import {model, Schema, Types} from 'mongoose';
import {IModel, modifySchema} from '../helpers/utils';

export interface IAccessToken extends IModel {
    userID: Types.ObjectId;
    clientID: Types.ObjectId;
    token: string;
    expiration: Date;
}

export const accessTokenSchema = new Schema<IAccessToken>({
    userID: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    clientID: {type: Schema.Types.ObjectId, required: true, ref: 'Client'},
    token: {type: String, required: true},
    expiration: {
        type: Date,
        immutable: true,
    },
});

accessTokenSchema.index({expiration: 1}, {expireAfterSeconds: 0});

accessTokenSchema.pre('save', function preSave(next) {
    if(!this.expiration) {
        if(!this.created) this.created = new Date();

        this.expiration = new Date(
            // 12 hours
            this.created.getTime() + 60 * 60 * 12 * 1000,
        );
    }

    return next();
});

modifySchema(accessTokenSchema);

export default model<IAccessToken>('AccessToken', accessTokenSchema);
