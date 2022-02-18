import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import catchAsync from '../utils/catchAsync'
import { storage } from '../storage/main'
import { stringify } from 'uuid'

export class UserValidator {
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
        interestedCategories: Joi.array().items(Joi.string().uuid()),
        photo: Joi.string()
    })

    updateSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string()
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        interestedCategories: Joi.array().items(Joi.string().uuid()),
        photo: Joi.string()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        return error ? next(error) : next()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name, interestedCategories } = req.body
        if (name) req.body.name = JSON.parse(name)
        if (interestedCategories) req.body.interestedCategories = JSON.parse(interestedCategories)
        const { error } = this.createSchema.validate(req.body)
        return error ? next(error) : next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name, interestedCategories } = req.body
        if (name) req.body.name = JSON.parse(name)
        if (interestedCategories) req.body.interestedCategories = JSON.parse(interestedCategories)
        const { error } = this.updateSchema.validate(req.body)
        return error ? next(error) : next()
    })
}
