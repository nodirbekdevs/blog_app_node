import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import AppError from '../utils/appError'
import { error_message } from '../locales/get_message'
const { error_messages } = require('../locales/error_messages.json')

export class ErrorController {
    sendErrorDev = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        let message = err.message
        if (error_messages.hasOwnProperty(err.message)) {message = error_message(err.message, res.locals.lang)}

        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: message,
            stack: err.stack
        })
    }

    sendErrorProd = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message
            })
        }

        // B) Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err)
        res.status(500).json({
            success: false,
            message: 'Something went very wrong!'
        })
    }

    handle = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        err.statusCode = err.statusCode || 500
        err.status = err.status || 'error'

        if (config.NodeEnv === 'development') {
            this.sendErrorDev(err, req, res, next)
        } else if (config.NodeEnv === 'production') {
            this.sendErrorProd(err, req, res, next)
        }
    }
}
