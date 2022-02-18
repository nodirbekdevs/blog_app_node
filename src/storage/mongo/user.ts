import { UserRepo, IUserAllResponse } from '../repo/user'
import User, { IUser } from '../../models/User'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class UserStorage implements UserRepo {
    private scope = 'storage.user'

    async find(query: Object): Promise<IUser[]> {
        try {
            let users = await User.find({ ...query }).populate("interestedCategories")
            return users
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IUser> {
        try {
            console.log(query)
            let user = await User.findOne(query).populate("interestedCategories")
            if (!user) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'user_404')
            }
            return user
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IUser): Promise<IUser> {
        try {
            let user = await User.create(payload)
            return user
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IUser): Promise<IUser> {
        try {
            let user = await User.findByIdAndUpdate(id, payload, {new: true})
            if (!user) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'user_404')
            }
            return user
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let user = await User.findByIdAndDelete(id)
            if (!user) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'user_404')
            }
            return user
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
