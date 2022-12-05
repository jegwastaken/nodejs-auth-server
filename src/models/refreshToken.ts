/* eslint-disable no-param-reassign */
import {model, Schema, Types} from 'mongoose';
import {IModel, modifySchema} from '../helpers/utils';

export interface IRefreshToken extends IModel {
    userID: Types.ObjectId;
    clientID: Types.ObjectId;
    accesstoken: string;
    token: string;
    expiration: Date;
}

export const refreshTokenSchema = new Schema<IRefreshToken>({
    userID: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    clientID: {type: Schema.Types.ObjectId, required: true, ref: 'Client'},
    accesstoken: {type: String, required: true},
    token: {type: String, required: true},
    expiration: {
        type: Date,
        immutable: true,
    },
});

refreshTokenSchema.index({expiration: 1}, {expireAfterSeconds: 0});

refreshTokenSchema.pre('save', function preSave(next) {
    if(!this.expiration) {
        if(!this.created) this.created = new Date();

        this.expiration = new Date(
            // 14 days
            this.created.getTime() + 60 * 60 * 24 * 14 * 1000,
        );
    }

    return next();
});

modifySchema(refreshTokenSchema);

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);
