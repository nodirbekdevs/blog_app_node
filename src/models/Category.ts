import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ICategory extends Document {
    _id: string
    name: string
    total_blogs: number
    madeAt: number
}

const categorySchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    total_blogs: {
        type: Number
    },
    madeAt: {
        type: Number,
        default: Date.now
    }
})

export default model<ICategory>('Category', categorySchema)
