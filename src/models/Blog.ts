import { Schema, Document, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IBlog extends Document {
    _id: string
    maker: string
    category: string
    title: string
    content: string
    images: string[]
    madeAt: Date
}

export default model<IBlog>('Blog', new Schema({
    _id: {type: String, default: uuidv4},
    maker: {type: String, ref: 'Admin'},
    category: {type: String, ref: 'Category'},
    title: {type: String},
    content: {type: String},
    images: [{type: String, default: ''}],
    madeAt: {type: Date, default: Date.now}
}))
