import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

// export default () => {
//     return multer({
//         storage: multer.diskStorage({
//             destination: function (req, file, cb) {cb(null, './../../uploads/')},
//             filename: function (req: any, file: any, cb: any) {cb(null, `${Date.now()}-${file.originalname}`)}
//         }),
//         fileFilter: (req, file, cb) => {
//             file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ? cb(null, true) : cb(null, false));
//         }
//         limits: { fileSize: 1024 * 1024 * 5 }
//     })
// }


// const storage = multer.diskStorage({
//     destination(req, file, cb) {cb(null, 'uploads/')},
//     filename(req, file, cb) {cb(null, `${Date.now()}-${file.originalname}`)}
// })
//
// const fileFilter = (req: Request, file: Express.Multer.File, cb: CallableFunction) => {
//     file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ? cb(null, true) : cb(null, false)
// }
//
// const limits = {fileSize: 1024 * 1024 * 5}

import { Options, diskStorage } from 'multer'
import { resolve } from 'path'

export const multerConfig = {
    storage: diskStorage({
        destination: (request, file, cb) => {
            cb(null, resolve(__dirname, '..', '..', 'uploads'))
        },
        filename: (request, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (request, file, callback) => {
        const formats = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]
        if (formats.includes(file.mimetype)) {callback(null, true)}
        else {callback(new Error('Format not accepted'))}
    }
} as Options
