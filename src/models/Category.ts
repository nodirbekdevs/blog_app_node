import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ICategory extends Document {
    _id: string
    name: string
    total_blogs: number
    madeAt: Date
}

export default model<ICategory>('Category', new Schema({
    _id: {type: String, default: uuidv4},
    name: {type: String, required: true},
    total_blogs: {type: Number},
    madeAt: {type: Date, default: Date.now}
}))
