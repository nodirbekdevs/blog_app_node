import { Router } from 'express'
import multer from 'multer'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import { AuthUserValidator} from '../validators/auth'
import {multerConfig} from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const authValidator = new AuthUserValidator()
const middleware = new Middleware()

// const transfer = multer(multerConfig).single('photo')

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(validator.create, controller.create)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(controller.delete)
router.post('/login', authValidator.login, controller.login)

export default router
