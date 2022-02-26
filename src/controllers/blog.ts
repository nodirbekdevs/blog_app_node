import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import { unlink } from 'fs/promises'
import AppError from '../utils/appError'
import { join } from 'path'
import sharp from 'sharp'

export class BlogController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.findOne({ name: req.query.category })
        const blogs = await storage.blog.find({})
        res.status(200).json({ success: true, data: { blogs } })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                blog
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let isCategory: any = await storage.category.findOne({ _id: req.body.category })

        if (!isCategory) {
            return new AppError(400, 'category_error')
        }

        const blog = await storage.blog.create({ ...req.body, maker: res.locals.id })

        await storage.category.update(req.body.category, { $inc: { total_blogs: 1 } })

        res.status(201).json({
            success: true,
            data: {
                blog
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const exist = await storage.blog.findOne({ _id: req.params.id })

        if (exist.maker !== res.locals.id) {
            return next(new AppError(400, 'Siz bu blogga tega olmaysis'))
        }

        const nc = await storage.category.findOne({ _id: req.body.category })

        if (nc._id === exist.category) {
            return next()
        } else if (req.body.category !== exist.category) {
            await storage.category.update(exist.category, { $inc: { total_blogs: -1 } })
            await storage.category.update(req.body.category, { $inc: { total_blogs: +1 } })
        }
        const blog = await storage.blog.update(req.params.id, req.body)

        res.status(201).json({
            success: true,
            data: {
                blog
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const exist = await storage.blog.findOne({ _id: req.params.id })

        await storage.category.update(exist.category, { $inc: { total_blogs: -1 } })

        if (exist.images) {
            exist.images.map(async (image) => {
                if (image.startsWith('images')) await unlink(join(__dirname, '../../uploads', image))
            })
        }

        await storage.blog.delete(req.params.id)

        res.status(204).json({
            success: true,
            data: null
        })
    })

    uploadPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.files) {
            return next(new AppError(400, 'photo_400'))
        }

        let files: object[] = JSON.parse(JSON.stringify(req.files)), photos: string[] = []

        await Promise.all(
            files.map(async (file: any) => {
                const photo = `images/photo/${file.fieldname}-${uuidv4()}`

                await sharp(file.buffer)
                    .resize({ width: 500 })
                    .png()
                    .toFile(join(__dirname, '../../uploads', `${photo}.png`))
                photos.push(photo)
            })
        )

        let blog = await storage.blog.findOne({ _id: req.body.id })

        if (blog.images) {
            blog.images.map(async (image) => {
                await unlink(join(__dirname, '../../uploads', image))
            })
        }

        blog.images = photos

        blog = await blog.save()

        res.status(201).json({
            success: true,
            data: {
                blog
            }
        })
    })
}
