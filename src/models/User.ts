import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    _id: string
    name: {firstName: string, lastName: string}
    phone_number: string
    password: string
    interestedCategories: string[]
    photo: string
    madeAt: Date
}

export default model<IUser>('User', new Schema({
    _id: {type: String, default: uuidv4},
    name: {
        first_name: {type: String},
        last_name: {type: String},
    },
    phone_number: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    interestedCategories: [{type: String, ref: 'Category'}],
    photo: {type: String, default: ''},
    madeAt: {type: Date, default: Date.now}
}))
