import { Router } from 'express'
import multer from 'multer'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { multerConfig } from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()

const transfer = multer(multerConfig).single('photo')

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(transfer, validator.create, controller.create)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), transfer, validator.update, controller.update)
    .delete(controller.delete)

export default router
