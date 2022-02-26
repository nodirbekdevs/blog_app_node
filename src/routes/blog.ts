import { Router } from 'express'
import multer from '../middleware/multer'
import { BlogController } from '../controllers/blog'
import { BlogValidator } from '../validators/blog'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new BlogController()
const validator = new BlogValidator()
const middleware = new Middleware()

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router
    .route('/photo')
    .post(
        middleware.auth(['admin']),
        multer(['images/png', 'images/jpeg'], 20).array('images', 3),
        controller.uploadPhoto
    )
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
