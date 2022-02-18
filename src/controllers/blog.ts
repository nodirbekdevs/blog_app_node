import { NextFunction, Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'

const { join } = require('path')
const sharp = require('sharp')

export class BlogController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blogs = await storage.blog.find(req.query)
        res.status(200).json({ success: true, data: { blogs } })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.findOne({ _id: req.params.id })
        res.status(200).json({ success: true, data: { blog } })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.category.update(req.body.category, { $inc: { total_blogs: 1 } })
        if (!req.files) return next();
        req.body.images = [];
        let files = JSON.parse(JSON.stringify(req.files))
        await Promise.all(
            files.map(async (file: any) => {
                const image = `images/${file.fieldname}-${uuidv4()}`;
                await sharp(file.buffer).png().toFile(join(__dirname, '../../uploads', `${image}.png`))
                req.body.images.push(image);
            })
        );
        const blog = await storage.blog.create({ ...req.body })
        res.status(201).json({ success: true, data: { blog } })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let image
        if (req.file) {
            image = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${image}.png`))
        }
        const blog = await storage.blog.update(req.params.id, { ...req.body, images: `${image}.png` })
        res.status(200).json({ success: true, data: { blog } })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.blog.delete(req.params.id)
        res.status(204).json({ success: true, data: null })
    })
}
