import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
const path = require('path')
const sharp = require('sharp')

export class BlogController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blogs = await storage.blog.find(req.query)
        res.status(200).json({success: true, data: {blogs}})
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.findOne(req.query)
        res.status(200).json({success: true, data: {blog}})
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // let cat = req.body.category ? req.body.category : ''
        // let cate = await storage.category.findOne(cat)
        // await storage.category.add(cate)
        const blog = await storage.blog.create(req.body)
        // if (req.file) {
        //     const image = `images/${req.file.fieldname}-${uuidv4()}`
        //     await sharp(req.file.buffer)
        //         .png()
        //         .toFile(path.join(__dirname, '../../../uploads', `${image}.png`))
        // }
        res.status(201).json({success: true, data: {blog}})
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.update(req.params.id, req.body)
        res.status(200).json({success: true, data: {blog}})
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.blog.delete(req.params.id)
        res.status(204).json({success: true, data: null})
    })
}
