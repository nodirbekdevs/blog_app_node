import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path, { join, resolve } from 'path'
import sharp from 'sharp'
import { compareSync, genSalt, hashSync } from 'bcrypt'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const users = await storage.user.find(req.query)
        res.status(200).json({success: true, data: {users}})
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({_id: req.params.id })
        res.status(200).json({success: true, data: {user}})
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo;
        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${photo}.png`))
        }
        const user = await storage.user.create({ ...req.body, photo: `${photo}.png` })
        res.status(201).json({success: true, data: {user}})
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${photo}.png`))
        }
        const user = await storage.user.update(req.params.id, { ...req.body, photo:  `${photo}.png`})
        res.status(200).json({success: true, data: {user}})
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.user.delete(req.params.id)
        res.status(204).json({success: true, data: null})
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body
        console.log(phone_number, password)
        const candidate = await storage.user.findOne({ phone_number })
        const isValidPassword = await compareSync(password, candidate.password)
        if (!isValidPassword) return next(new AppError(403, 'Noto`g`ri parol'))
        signToken(candidate._id, 'user').then(token =>{
            res.status(200).json({ success: true, data: { token } })
        }).catch(err=>{return next(new AppError(500,err))})
    })

    register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.create(req.body)
        const token = signToken(user._id, 'user')
        res.status(201).json({ success: true, data: { user, token } })
    })

    updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../uploads', `${photo}.png`))
        }
        const user = await storage.user.update(res.locals.id, { ...req.body, photo:  `${photo}.png`})
        res.status(200).json({success: true, data: {user}})
    })
}
