import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { hashSync } from 'bcrypt'

export interface IAdmin extends Document {
    _id: string
    name: {firstName: string, lastName: string}
    phone_number: string
    password: string
    photo: string
    type: string
    madeAt: Date
}

const admin = new Schema({
    _id: {type: String, default: uuidv4},
    name: {
        first_name: {type: String},
        last_name: {type: String},
    },
    phone_number: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    photo: {type: String, default: ''},
    type: {type: String, default: 'admin'},
    madeAt: {type: Date, default: Date.now}
})

admin.pre<IAdmin>('save', async function (next) {
    const hash = await hashSync(this.password, 10);
    this.password = hash
    next()
})

export default model<IAdmin>('Admin', admin)
