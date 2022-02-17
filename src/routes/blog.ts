import { Router } from 'express'
import multer from 'multer'
import {multerConfig} from '../middleware/multer'
import { BlogController } from '../controllers/blog'
import { BlogValidator } from '../validators/blog'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new BlogController()
const validator = new BlogValidator()
const middleware = new Middleware()

const transfer = multer(multerConfig).array('images', 10)

router.route('/all').get(middleware.auth(['admin','user']),controller.getAll)
router
    .route('/create')
    .post(transfer, validator.create, controller.create)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), transfer, validator.update, controller.update)
    .delete(controller.delete)

export default router
