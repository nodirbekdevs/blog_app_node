import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { unlink } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { hash, genSalt, compare } from 'bcrypt'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'
import {message} from './../locales/get_message'

export class AdminController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const admins = await storage.admin.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                admins
            },
            message: message('sample_getAll_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admin = await storage.admin.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                admin
            }
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body

        const admin = (await storage.admin.find({ phone_number }))[0]

        if (!admin || !(await compare(password, admin.password))) {
            return next(new AppError(401, 'auth_401'))
        }

        const token = await signToken(admin.id, 'admin')

        res.status(200).json({
            success: true,
            data: {
                admin,
                token
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, role } = res.locals
        const {password} = req.body

        let admin = await storage.admin.findOne({ _id: id })

        if (admin.type !== 'super_admin') {
            return next(new AppError(403, 'admin_403'))
        }

        if (password) {
            const salt = await genSalt(10)
            req.body.password = await hash(password, salt)
        }

        admin = await storage.admin.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                admin
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = res.locals
        const _id = req.params.id
        const { password } = req.body
        let admin = await storage.admin.findOne({ _id: id })

        if (admin.type === 'admin' && id !== _id) {
            return next(new AppError(403, 'admin_403'))
        }

        if (password) {
            const salt = await genSalt(10)
            req.body.password = await hash(password, salt)
        }

        admin = await storage.admin.update(_id, req.body)

        res.status(200).json({
            success: true,
            data: {
                admin
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = res.locals
        const _id = req.params.id
        let admin = await storage.admin.findOne({ _id: id })

        if (admin.type !== 'super_admin' || id === _id) {
            return next(new AppError(403, 'admin_403'))
        }

        if (admin.photo) {
            await unlink(join(__dirname, '../../uploads', admin.photo))
        }

        await storage.admin.delete(_id)
        await storage.blog.updateMany(admin._id, {maker: res.locals.id})

        res.status(200).json({
            success: true,
            data: null
        })
    })

    createSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body

        const salt = await genSalt(10)
        const hashed_password = await hash(password, salt)

        const admin = await storage.admin.create({
            ...req.body,
            password: hashed_password,
            type: 'super_admin'
        })

        const token = await signToken(admin.id, 'admin')

        res.status(201).json({
            success: true,
            data: {
                admin,
                token
            }
        })
    })

    uploadPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = res.locals

        if (!req.file) {
            return next(new AppError(400, 'photo_400'))
        }

        const photo = `images/photo/${req.file.fieldname}-${uuidv4()}`

        await sharp(req.file.buffer)
            .resize({ width: 500 })
            .png()
            .toFile(join(__dirname, '../../uploads', `${photo}.png`))

        let admin = await storage.admin.findOne({ _id: id })

        if (admin.photo) {
            await unlink(join(__dirname, '../../uploads', admin.photo))
        }

        admin.photo = `${photo}.png`

        admin = await admin.save()

        res.status(201).json({
            success: true,
            data: {
                admin
            }
        })
    })
}
