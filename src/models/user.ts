/* eslint-disable no-param-reassign */
import {model, Schema} from 'mongoose';
import {IModel, modifySchema} from '../helpers/utils';

export interface IUser extends IModel {
    username: string;
    email: string;
    password?: string;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface User extends Omit<IUser, '_id'> {
            ___?: never;
        }
    }
}

export const userSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
});

modifySchema(userSchema);

export default model<IUser>('User', userSchema);
