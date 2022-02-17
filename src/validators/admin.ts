import Joi from 'joi'
import {Request, Response, NextFunction} from 'express'
import catchAsync from "../utils/catchAsync";
import log from 'loglevel'
import path from "path"

export class AdminValidator {
    keys = { required: 'required', optional: 'optional' }

    createSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        // photo: Joi.string(),
        type: Joi.string()
    })

    updateSchema = Joi.object({
        name: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().required(),
        photo: Joi.string(),
        type: Joi.string()

    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {name} = req.body
        if (name) {
            req.body.name = JSON.parse(name)
        }
        // @ts-ignore
        const photo = req.files.photo
        // @ts-ignore
        const photoType = photo.mimetype.split('/')[0]
        // @ts-ignore
        const photoName = photo.name.split('.')[0]
        // @ts-ignore
        const photoFormat = photo.mimetype.split('/')[1]
        // @ts-ignore
        const photoPath = path.join(__dirname, '..', 'uploads/', `${photoName}- ${photo.md5}.${photoFormat}`)
        console.log(photoPath)
        if (photoType === 'image' || photoType === 'vector') {
            // @ts-ignore
            paths = await photo.mv(photoPath)
            // @ts-ignore
            req.files.photo = paths
        }
        req.body.photo_path = photoPath
        console.log(req.body)

        // const { error } = this.createSchema.validate(req.body)
        // return error ? next(error) : next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {name} = req.body
        if (name) {
            req.body.name = JSON.parse(name)
        }
        const { error } = this.updateSchema.validate(req.body)
        return error ? next(error) : next()
    })
}
