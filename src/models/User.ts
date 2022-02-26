import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { hashSync, genSalt } from 'bcrypt'

export interface IUser extends Document {
    _id: string
    name: { firstName: string, lastName: string }
    phone_number: string
    password: string
    interestedCategories: string[]
    photo: string
    madeAt: number
}

const userSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
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
    interestedCategories: [{
        type: String,
        ref: 'Category'
    }],
    photo: {
        type: String,
        default: ''
    },
    madeAt: {
        type: Number,
        default: Date.now
    }
})

export default model<IUser>('User', userSchema)
