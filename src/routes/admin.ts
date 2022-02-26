import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new Middleware()

router.route('/super-admin').post(validator.create, controller.createSuperAdmin)
router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router.route('/login').post(validator.login, controller.login)
router
    .route('/photo')
    .post(
        middleware.auth(['admin']),
        multer(['images/png', 'images/jpeg'], 20).single('photo'),
        controller.uploadPhoto
    )
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
