import Joi from 'joi'
import {Request, Response, NextFunction} from 'express'
import catchAsync from "../utils/catchAsync";

export class AuthUserValidator {
    keys = {
        required: 'required',
        optional: 'optional'
    }

    loginSchema = Joi.object({
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        return error ? next(error) : next()
    })
}
