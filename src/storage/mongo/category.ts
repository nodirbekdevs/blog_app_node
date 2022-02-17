import { CategoryRepo, ICategoryAllResponse } from '../repo/category'
import Category, { ICategory } from '../../models/Category'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class CategoryStorage implements CategoryRepo {
    private scope = 'storage.category'

    async find(query: Object): Promise<ICategory[]> {
        try {
            let categories = await Category.find({ ...query })
            return categories
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<ICategory> {
        try {
            let category = await Category.findOne({ ...query })
            if (!category) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'sample_404')
            }
            return category
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    // async add(id: string): Promise<ICategory> {
    //     try {
    //         let category = await Category.findByIdAndUpdate(id,  {$inc: {total_blogs: +1}},{new: true})
    //         if (!category) {
    //             logger.warn(`${this.scope}.get failed to findOne`)
    //             throw new AppError(404, 'sample_404')
    //         }
    //         return category
    //     } catch (error) {
    //         logger.error(`${this.scope}.findOne: finished with error: ${error}`)
    //         throw error
    //     }
    // }

    async create(payload: ICategory): Promise<ICategory> {
        try {
            let category = await Category.create(payload)
            return category
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: ICategory): Promise<ICategory> {
        try {
            let category = await Category.findByIdAndUpdate(id, payload, {new: true})
            if (!category) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'sample_404')
            }
            return category
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let category = await Category.findByIdAndDelete(id)
            if (!category) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'sample_404')
            }
            return category
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
