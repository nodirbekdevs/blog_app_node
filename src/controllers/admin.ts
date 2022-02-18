import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import sharp from 'sharp'
import { compareSync } from 'bcrypt'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'

export class AdminController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admins = await storage.admin.find(req.query)
        res.status(200).json({ success: true, data: { admins } })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req)
        const admin = await storage.admin.findOne({_id: req.params.id })
        res.status(200).json({ success: true, data: { admin } })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        if (req.file) {
             photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${photo}.png`))
        }
        const admin = await storage.admin.create({ ...req.body, photo: `${photo}.png` })
        const token = await signToken(admin._id, admin.type)
        res.status(201).json({ success: true, data: { admin, token } })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${photo}.png`))
        }
        const admin = await storage.admin.update(req.params.id, { ...req.body, photo: `${photo}.png` })
        res.status(200).json({ success: true, data: { admin } })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.admin.delete(req.params.id)
        res.status(204).json({ success: true, data: null })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let isValidPassword
        const { phone_number, password } = req.body
        const candidate = await storage.admin.findOne({ phone_number })
        if (candidate) isValidPassword = await compareSync(password, candidate.password)
        if (!isValidPassword) return next(new AppError(403, 'Noto`g`ri parol'))
        signToken(candidate._id, candidate.type).then(token => {
            res.status(200).json({ success: true, data: { token } })
        }).catch(err => {
            return next(new AppError(500, err))
        })

    })
}
