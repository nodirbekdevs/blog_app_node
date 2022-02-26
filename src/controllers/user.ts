import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import { compare, genSalt, hash } from 'bcrypt'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const users = await storage.user.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                users
            }
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body

        const exist = await storage.user.findOne({ phone_number })

        if (password && !exist) {
            const salt = await genSalt(10)
            req.body.password = await hash(password, salt)
        }

        const user = await storage.user.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                user
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body

        if (password) {
            const salt = await genSalt(10)
            req.body.password = await hash(password, salt)
        }

        const user = await storage.user.update(req.params.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ _id: req.params.id })

        if (user.photo) {
            await unlink(join(__dirname, '../../uploads', user.photo))
        }

        await storage.user.delete(req.params.id)

        res.status(204).json({
            success: true,
            data: null
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body

        const user = await storage.user.findOne({ phone_number })

        if (!user || !(await compare(password, user.password))) {
            return next(new AppError(401, 'auth_401'))
        }

        const token = await signToken(user.id, 'admin')

        res.status(200).json({
            success: true,
            data: {
                user,
                token
            }
        })
    })

    updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body

        if (password) {
            const salt = await genSalt()
            req.body.password = await hash(password, salt)
        }

        const user = await storage.user.update(res.locals.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                user
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

        let user = await storage.admin.findOne({ _id: id })

        if (user.photo) {
            await unlink(join(__dirname, '../../uploads', user.photo))
        }

        user.photo = `${photo}.png`

        user = await user.save()

        res.status(201).json({
            success: true,
            data: {
                user
            }
        })
    })
}
