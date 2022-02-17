import { AdminRepo, IAdminAllResponse } from '../repo/admin'
import Admin, { IAdmin } from '../../models/Admin'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class AdminStorage implements AdminRepo {
    private scope = 'storage.admin'

    async find(query: Object): Promise<IAdmin[]> {
        try {
            let admins = await Admin.find({ ...query })
            return admins
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IAdmin> {
        try {
            console.log({...query},query)
            let admin = await Admin.findOne(query)
            if (!admin) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'admin_404')
            }
            return admin
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IAdmin): Promise<IAdmin> {
        try {
            let admin = await Admin.create(payload)
            return admin
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IAdmin): Promise<IAdmin> {
        try {
            let admin = await Admin.findByIdAndUpdate(id, payload, {new: true})
            if (!admin) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'sample_404')
            }
            return admin
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let admin = await Admin.findByIdAndDelete(id)
            if (!admin) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'sample_404')
            }
            return admin
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
