import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IAdmin extends Document {
    _id: string
    name: {
        firstName: string,
        lastName: string
    }
    phone_number: string
    password: string
    photo: string
    type: string
    madeAt: number
}

const adminSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        }
    },
    phone_number: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    },
    madeAt: {
        type: Number,
        default: Date.now
    }
})

export default model<IAdmin>('Admin', adminSchema)
