import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import AppError from '../utils/appError'

export class CategoryController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const categories = await storage.category.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                categories
            }
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                category
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.create(req.body)

        res.status(201).json({
            success: true,
            data: {
                category
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.update(req.params.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                category
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.findOne({ _id: req.params.id })

        if (category.total_blogs > 0) {
            return next(new AppError(400, 'Kategoriya bo`sh emas'))
        }

        await storage.category.delete(req.params.id)

        res.status(204).json({
            success: true,
            data: null
        })
    })
}
