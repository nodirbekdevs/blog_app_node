import { Router } from 'express'
import { CategoryController } from '../controllers/category'
import { CategoryValidator } from '../validators/category'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new CategoryController()
const validator = new CategoryValidator()
const middleware = new Middleware()

router.get('/all', middleware.auth(['user', 'admin']), controller.getAll)
router.get('/:id', middleware.auth(['user', 'admin']), controller.get)
router.post('/create', middleware.auth(['admin']), validator.create, controller.create)
router.patch('/:id', middleware.auth(['admin']), validator.update, controller.update)
router.delete('/:id', middleware.auth(['admin']), controller.delete)

export default router
