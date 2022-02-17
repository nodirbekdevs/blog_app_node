import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IAdmin extends Document {
    _id: string
    name: {firstName: string, lastName: string}
    phone_number: string
    password: string
    photo: string
    type: string
    madeAt: Date
}

export default model<IAdmin>('Admin', new Schema({
    _id: {type: String, default: uuidv4},
    name: {
        first_name: {type: String},
        last_name: {type: String},
    },
    phone_number: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    photo_path: {type: String, default: ''},
    type: {type: String, default: 'admin'},
    madeAt: {type: Date, default: Date.now}
}))
