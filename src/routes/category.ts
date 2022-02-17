import { Router } from 'express'
import { CategoryController } from '../controllers/category'
import { CategoryValidator } from '../validators/category'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new CategoryController()
const validator = new CategoryValidator()
const middleware = new Middleware()

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(validator.create, controller.create)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(controller.delete)

export default router
