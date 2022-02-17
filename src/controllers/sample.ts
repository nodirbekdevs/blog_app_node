import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import { message } from '../locales/get_message'

export class SampleController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const samples = await storage.sample.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                samples
            },
            message: message('sample_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const sample = await storage.sample.findOne(req.query)

        res.status(200).json({
            success: true,
            data: {
                sample
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const sample = await storage.sample.create(req.body)

        if (req.file) {
            const image = `images/${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../../uploads', `${image}.png`))
        }

        res.status(201).json({
            success: true,
            data: {
                sample
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const sample = await storage.sample.update(req.params.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                sample
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.sample.delete(req.params.id)

        res.status(204).json({
            success: true,
            data: null
        })
    })
}
