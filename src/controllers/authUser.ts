import { NextFunction, Request, Response } from 'express'
import { signToken } from '../middleware/auth'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { compareSync, hashSync } from 'bcrypt'

export class AuthUserController {
    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { phone_number, password } = req.body
        const candidate = await storage.user.findOne({ phone_number })
        // const isValidPassword = await compareSync(password, candidate.password)
        // if (!isValidPassword) return next(new AppError(403, 'Noto`g`ri parol'))
        signToken(candidate._id, 'user').then(token =>{
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

    register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password, phone_number } = req.body
        const candidate = await storage.user.findOne({ phone_number })
        req.body.password = await hashSync(password, 10)
        const user = await storage.user.create(req.body)
        res.status(201).json({ success: true, data: { user } })
    })
}
