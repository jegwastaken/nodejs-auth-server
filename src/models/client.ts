import {model, Schema, Types} from 'mongoose';
import {IModel, modifySchema} from '../helpers/utils';

export interface IClient extends IModel {
    clientname: string;
    clientsecret?: string;
    redirectURI: string;
    userID: Types.ObjectId;
    trusted: boolean;
}

export const clientSchema = new Schema<IClient>({
    clientname: {type: String, required: true},
    clientsecret: {type: String, required: true, select: false},
    redirectURI: {type: String, required: true},
    userID: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    trusted: {
        type: Boolean,
        required: true,
        default: false,
        immutable: true,
    },
});

modifySchema(clientSchema);

export default model<IClient>('Client', clientSchema);
