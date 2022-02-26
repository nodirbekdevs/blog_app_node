import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import catchAsync from '../utils/catchAsync'

export class UserValidator {
    keys = { required: 'required', optional: 'optional' }

    loginSchema = Joi.object({
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required()
    })

    createSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        }).required(),
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required(),
        interestedCategories: Joi.array().items(Joi.string().uuid()),
    })

    updateSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        }),
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required(),
        interestedCategories: Joi.array().items(Joi.string().uuid()),
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        return error ? next(error) : next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
