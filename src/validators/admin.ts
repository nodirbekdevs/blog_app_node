import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class AdminValidator {
    private loginSchema = Joi.object({
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required()
    })

    private createSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        }).required(),
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required()
    })

    private updateSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        }),
        phone_number: Joi.number().integer(),
        password: Joi.string()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
