import multer from 'multer'

export default (types: string[], size: number) => {
    return multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            return !types.includes(file.mimetype)  ? cb(null, false) : cb(null, true)
        },
        limits: { fileSize: 1024 * 1024 * size }
    })
}
