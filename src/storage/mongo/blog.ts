import { BlogRepo } from '../repo/blog'
import Blog, { IBlog } from '../../models/Blog'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class BlogStorage implements BlogRepo {
    private scope = 'storage.blog'

    async find(query: Object): Promise<IBlog[]> {
        try {
            let blogs = await Blog.find({ ...query })
            if (!blogs) {
                logger.warn(`${this.scope}.get failed to findByQuery`)
                throw new AppError(404, 'blog_404')
            }
            return blogs
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IBlog> {
        try {
            let blog = await Blog.findOne({ ...query })
            if (!blog) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'blog_404')
            }
            return blog
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IBlog): Promise<IBlog> {
        try {
            let blog = await Blog.create(payload)
            return blog
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(id: string, payload: Object): Promise<any> {
        try {
            let blogs = await Blog.updateMany({ maker: id }, payload)
            if (!blogs) {
                logger.warn(`${this.scope}.update failed to updateMany`)
                throw new AppError(404, 'blog_404')
            }
            return blogs
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IBlog): Promise<IBlog> {
        try {
            let blog = await Blog.findByIdAndUpdate(id, payload, { new: true })
            if (!blog) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'blog_404')
            }
            return blog
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let blog = await Blog.findByIdAndDelete(id)
            if (!blog) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'blog_404')
            }
            return blog
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
