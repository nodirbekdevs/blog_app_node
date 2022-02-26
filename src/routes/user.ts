import { Router } from 'express'
import multer from './../middleware/multer'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router.route('/login').post(validator.login, controller.login)
router.route('/profile/update').post(middleware.auth(['user']), validator.update, controller.updateProfile)
router
    .route('/photo')
    .post(
        middleware.auth(['user']),
        multer(['images/png', 'images/jpeg'], 20).single('photo'),
        controller.uploadPhoto
    )
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
