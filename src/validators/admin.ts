import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import catchAsync from '../utils/catchAsync'
import log from 'loglevel'
import path from 'path'

export class AdminValidator {
    keys = { required: 'required', optional: 'optional' }

    loginSchema = Joi.object({
        phone_number: Joi.string().required(),
        password: Joi.string().required()
    })

    createSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string()
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        type: Joi.string()
    })

    updateSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string()
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        type: Joi.string()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        return error ? next(error) : next()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body
        if (name) req.body.name = JSON.parse(name)
        console.log(req.body)
        const { error } = this.createSchema.validate(req.body)
        return error ? next(error) : next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body
        if (name) req.body.name = JSON.parse(name)

        const { error } = this.updateSchema.validate(req.body)
        return error ? next(error) : next()
    })
}
