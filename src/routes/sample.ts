import { Router } from 'express'
import { SampleController } from '../controllers/sample'
import { SampleValidator } from '../validators/sample'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new SampleController()
const validator = new SampleValidator()
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
