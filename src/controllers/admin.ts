import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'

import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import { compareSync } from 'bcrypt'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'

export class AdminController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admins = await storage.admin.find(req.query)
        res.status(200).json({success: true, data: {admins}})
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admin = await storage.admin.findOne(req.query)
        res.status(200).json({success: true, data: {admin}})
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {phone_number} = req.body
        const exists = await storage.admin.findOne(phone_number)
        const admin = await storage.admin.create(req.body)
        res.status(201).json({success: true, data: {admin}})
        // // @ts-ignore
        // console.log(req.files.photo.mimeType)
        // const admin = await storage.admin.create()
        // let image = req.files
        // if (req.file) {
        //     const photo = `images/${req.file.fieldname}-${uuidv4()}`
        //     await sharp(req.file.buffer)
        //         .png()
        //         .toFile(path.join(__dirname, '../../../uploads', `${photo}.png`))
        // }
        // res.status(201).json({success: true, data: {admin}})
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admin = await storage.admin.update(req.params.id, req.body)
        res.status(200).json({success: true, data: {admin}})
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.admin.delete(req.params.id)
        res.status(204).json({success: true, data: null})
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body
        const candidate = await storage.admin.findOne({ phone_number } )

        // const isValidPassword = await compareSync(password, candidate.password)
        // if (!isValidPassword) return next(new AppError(403, 'Noto`g`ri parol'))

        signToken(candidate._id, candidate.type).then(token =>{
            res.status(200).json({
                success: true,
                data: {
                    token
                }
            })
        }).catch(err=>{
            return next(new AppError(500,err))
        })

    })
}
