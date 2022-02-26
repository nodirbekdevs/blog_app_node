import { Router } from 'express'
import { CategoryController } from '../controllers/category'
import { CategoryValidator } from '../validators/category'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new CategoryController()
const validator = new CategoryValidator()
const middleware = new Middleware()

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router.route('/create').post(middleware.auth(['admin']), validator.create, controller.create)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
