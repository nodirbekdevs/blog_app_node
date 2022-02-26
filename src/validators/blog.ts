import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import catchAsync from '../utils/catchAsync'

export class BlogValidator {
    keys = {
        required: 'required',
        optional: 'optional'
    }

    createSchema = Joi.object({
        category: Joi.string().uuid().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        images: Joi.array().items(Joi.string()),
    })

    updateSchema = Joi.object({
        category: Joi.string().uuid().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        images: Joi.array().items(Joi.string()),
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
