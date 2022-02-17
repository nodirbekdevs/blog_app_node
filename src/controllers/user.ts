import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import { genSalt, hashSync } from 'bcrypt'

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const users = await storage.user.find(req.query)
        res.status(200).json({success: true, data: {users}})
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne(req.query)
        res.status(200).json({success: true, data: {user}})
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {phone_number, password} = req.body
        const exists = await storage.user.findOne({phone_number})
        req.body.password = hashSync(password, 10)
        const user = await storage.user.create(req.body)
        if (req.file) {
            const photo = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../../uploads', `${photo}.png`))
        }
        res.status(201).json({success: true, data: {user}})
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.update(req.params.id, req.body)
        res.status(200).json({success: true, data: {user}})
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.user.delete(req.params.id)
        res.status(204).json({success: true, data: null})
    })
}
